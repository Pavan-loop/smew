"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LeadForm from "./LeadForm";
import TypingIndicator from "./TypingIndicator";
import { API_BASE, apiFetch, SESSION_KEY } from "../lib/chat-api";
import { copy, type Language } from "../lib/chat-copy";
import { readSSE } from "../lib/sse";
import "./chat.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  action?: { action: "show_lead_form"; language?: Language } | null;
};
type Retry = { message: string; requestId: string };
// Touch devices: avoid programmatic focus that would pop up the on-screen keyboard.
const coarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(pointer: coarse)").matches;

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [ready, setReady] = useState(false);
  // Set on hover/focus of the chat button or when a saved chat exists, so the session is ready before opening.
  const [warm, setWarm] = useState(false);
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState<Retry | null>(null);
  const tokenRef = useRef<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const busy = useRef(false);
  // A message sent while the session is still connecting goes out as soon as it is ready.
  const queuedRef = useRef<string | null>(null);
  const refocusInput = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = copy[language];
  const hidden = pathname.startsWith("/admin");
  const wanted = open || warm;

  // Pre-warm when the browser is idle: restore a saved chat (no new session), otherwise just wake the API.
  // New sessions are only created on hover/focus/open, so page views do not use up the daily session quota.
  useEffect(() => {
    if (hidden) return;
    const run = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(SESSION_KEY);
      } catch {
        /* storage may be unavailable */
      }
      if (stored) setWarm(true);
      else
        void fetch(`${API_BASE}/healthz`, {
          cache: "no-store",
          credentials: "omit",
        }).catch(() => undefined);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 2000);
    return () => clearTimeout(id);
  }, [hidden]);

  useEffect(() => {
    if (!wanted || ready || hidden) return;
    let cancelled = false;
    const controller = new AbortController();
    const initializationTimeout = setTimeout(() => controller.abort(), 20000);
    async function initialize() {
      try {
        let stored: string | null = null;
        try {
          stored = localStorage.getItem(SESSION_KEY);
        } catch {
          /* storage may be unavailable */
        }
        if (stored) {
          const response = await apiFetch("/session", stored, {
            signal: controller.signal,
          });
          if (response.ok) {
            const data = await response.json();
            if (cancelled) return;
            tokenRef.current = stored;
            setSessionToken(stored);
            setMessages(data.messages);
            setLeadSaved(data.lead_captured);
            if (["en", "kn", "kanglish"].includes(data.language))
              setLanguage(data.language);
            setReady(true);
            setError("");
            return;
          }
          if (response.status !== 401) throw new Error("Session unavailable");
          try {
            localStorage.removeItem(SESSION_KEY);
          } catch {
            /* no storage */
          }
        }
        const response = await apiFetch("/session", null, {
          method: "POST",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Session unavailable");
        const data = await response.json();
        if (cancelled) return;
        tokenRef.current = data.session_token;
        setSessionToken(data.session_token);
        try {
          localStorage.setItem(SESSION_KEY, data.session_token);
        } catch {
          /* token stays in memory */
        }
        setReady(true);
        setError("");
      } catch {
        if (!cancelled) setError(copy.en.unavailable);
      } finally {
        clearTimeout(initializationTimeout);
      }
    }
    void initialize();
    return () => {
      cancelled = true;
      clearTimeout(initializationTimeout);
      controller.abort();
    };
  }, [wanted, ready, hidden, sessionAttempt]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);
  useEffect(() => {
    if (open && ready && !coarsePointer()) inputRef.current?.focus();
  }, [open, ready]);
  // Return focus to the input once a reply finishes, so the user can type straight away.
  useEffect(() => {
    if (!open) refocusInput.current = false;
    if (!open || !ready || loading || !refocusInput.current) return;
    refocusInput.current = false;
    inputRef.current?.focus({ preventScroll: true });
  }, [open, ready, loading]);
  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    if (!ready || !queuedRef.current) return;
    const message = queuedRef.current;
    queuedRef.current = null;
    void send(message);
    // send() is recreated every render; only the transition to ready matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  async function send(preset?: string, previous?: Retry) {
    const message = (previous?.message ?? preset ?? input).trim();
    if (!message || busy.current) return;
    if (!ready || !tokenRef.current) {
      // Still connecting: keep the text visible and send it once the session is ready.
      queuedRef.current = message;
      if (preset) setInput(preset);
      return;
    }
    busy.current = true;
    // Refocus after the reply if the user was typing, or on desktop after a chip/retry click.
    refocusInput.current =
      document.activeElement === inputRef.current || !coarsePointer();
    setLoading(true);
    setError("");
    setRetry(null);
    setInput("");
    const requestId = previous?.requestId ?? crypto.randomUUID();
    const index = previous ? messages.length - 1 : messages.length + 1;
    if (previous)
      setMessages((old) =>
        old.map((m, i) =>
          i === index ? { role: "assistant", content: "" } : m,
        ),
      );
    else
      setMessages((old) => [
        ...old,
        { role: "user", content: message },
        { role: "assistant", content: "" },
      ]);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 65000);
    const update = (value: Partial<Message>) =>
      setMessages((old) =>
        old.map((m, i) => (i === index ? { ...m, ...value } : m)),
      );
    let reply = "";
    let serverError = false;
    try {
      const response = await apiFetch("/chat", tokenRef.current, {
        method: "POST",
        body: JSON.stringify({ message, request_id: requestId, language }),
        signal: controller.signal,
      });
      if (response.status === 401) {
        tokenRef.current = null;
        setSessionToken(null);
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          /* no storage */
        }
        throw new Error("Session expired");
      }
      if (!response.ok || !response.body) throw new Error("Chat unavailable");
      await readSSE(response.body, (event) => {
        if (event.type === "text") {
          reply += event.text;
          update({ content: reply });
          if (event.language) setLanguage(event.language);
        } else if (event.type === "action") update({ action: event });
        else if (event.type === "error") {
          serverError = true;
          update({ content: event.text, action: null });
        }
      });
      // A completed provider error needs a NEW request ID; the old one replays its result.
      if (serverError) setRetry({ message, requestId: crypto.randomUUID() });
    } catch {
      update({ content: t.unavailable, action: null });
      setRetry({ message, requestId });
    } finally {
      clearTimeout(timeout);
      controllerRef.current = null;
      busy.current = false;
      setLoading(false);
    }
  }

  function restart() {
    if (busy.current) return;
    if (
      messages.length &&
      !window.confirm(
        language === "kn"
          ? "ಹೊಸ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಬೇಕೇ?"
          : "Start a new conversation?",
      )
    )
      return;
    tokenRef.current = null;
    setSessionToken(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* no storage */
    }
    setMessages([]);
    setLeadSaved(false);
    setRetry(null);
    setError("");
    setReady(false);
    setSessionAttempt((attempt) => attempt + 1);
  }

  if (hidden) return null;
  return (
    <div className="smew-chat-root">
      <button
        className="smew-chat-toggle"
        onClick={() => {
          if (!open && error && !ready) {
            setError("");
            setSessionAttempt((attempt) => attempt + 1);
          }
          setOpen(!open);
        }}
        onPointerEnter={() => setWarm(true)}
        onFocus={() => setWarm(true)}
        onTouchStart={() => setWarm(true)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls="smew-chat-panel"
      >
        {open ? (
          "×"
        ) : (
          <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
      {open && (
        <section
          id="smew-chat-panel"
          className="smew-chat-panel"
          role="region"
          aria-label={t.title}
        >
          <header className="smew-chat-header">
            <div>
              <strong>{t.title}</strong>
              <small>{t.status}</small>
            </div>
            <button
              onClick={restart}
              disabled={loading}
              className="smew-chat-reset"
            >
              {t.restart}
            </button>
            <button
              aria-label={t.close}
              onClick={() => setOpen(false)}
              className="smew-chat-close"
            >
              ×
            </button>
          </header>
          <div className="smew-chat-language">
            <label htmlFor="smew-language">Language / ಭಾಷೆ</label>
            <select
              id="smew-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              disabled={loading}
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="kanglish">Kanglish</option>
            </select>
          </div>
          <div
            ref={listRef}
            className="smew-chat-messages"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {/* The greeting stays as the first bubble (it used to vanish after the first message). */}
            <div className="smew-message assistant">{t.greeting}</div>
            {open && !ready && !error && (
              <p className="smew-chat-connecting" role="status">
                {t.connecting}
              </p>
            )}
            {messages.map((message, index) =>
              loading && index === messages.length - 1 && !message.content ? (
                <TypingIndicator
                  key={index}
                  label={t.typing}
                  steps={t.typingSteps}
                />
              ) : (
                <div key={index} className={`smew-message ${message.role}`}>
                  {message.content}
                  {message.action?.action === "show_lead_form" &&
                    sessionToken &&
                    !leadSaved && (
                      <LeadForm
                        sessionToken={sessionToken}
                        language={language}
                        onSaved={() => {
                          setLeadSaved(true);
                          setMessages((old) => [
                            ...old,
                            { role: "assistant", content: t.saved },
                          ]);
                        }}
                      />
                    )}
                </div>
              ),
            )}
            {retry && !loading && (
              <button
                className="smew-chat-retry"
                onClick={() => void send(undefined, retry)}
                disabled={!sessionToken}
              >
                {t.retry}
              </button>
            )}
            {error && (
              <p role="alert" className="smew-error">
                {error}
              </p>
            )}
          </div>
          {!messages.length && (
            <div className="smew-chat-chips">
              {t.chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => void send(chip)}
                  disabled={loading}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <form
            className="smew-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              aria-label={t.placeholder}
              placeholder={t.placeholder}
              // Always enabled (also while connecting): disabling drops focus (and the mobile keyboard)
              // and looked broken. send() queues or ignores submits until the session/reply is ready.
            />
            <button
              type="submit"
              aria-label={t.send}
              disabled={!input.trim() || loading}
              // Keep focus in the input when the send button is clicked or tapped.
              onMouseDown={(e) => e.preventDefault()}
            >
              ➤
            </button>
          </form>
          <footer className="smew-chat-footer">
            <a
              href="https://wa.me/919986464819"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · 9986464819
            </a>
            <details>
              <summary>Privacy / ಗೌಪ್ಯತೆ</summary>
              <p>{t.privacy}</p>
            </details>
          </footer>
        </section>
      )}
    </div>
  );
}

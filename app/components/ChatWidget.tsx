"use client";
import { useEffect, useRef, useState } from "react";
import LeadForm from "./LeadForm";
import WhatsAppButton from "./WhatsAppButton";
import { Fallback } from "next/dist/client/components/segment-cache/cache-map";
import { tr } from "framer-motion/client";

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API;
const VISITOR_ID_KEY = "smew_visitor_id";

const FALLBACK_MESSAGE =
  "I couldn't process that right now. Please call us at 9986464819 or WhatsApp +91 9986464819 — we're happy to help!";

type ChatAction =
  | {
      action: "show_lead_form";
      service?: string;
      notes?: string;
      location?: string;
      name?: string;
    }
  | { action: "show_whatsapp"; url: string }
  | { action: "acknowledge_existing"; [key: string]: unknown };

type SSEEvent =
  | { type: "visitor"; visitor_id: string; session_id: string }
  | { type: "text"; text: string }
  | ({ type: "action" } & ChatAction)
  | { type: "done" }
  | { type: "error"; text: string };

type Message = { role: "bot" | "user"; content: string; action?: ChatAction };

const GOLD = "#b8860b";
const DARK = "#0f0f0f";
const BORDER = "#e4e0da";

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const leadCapturedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const [chipsHidden, setChipsHidden] = useState(false);
  const [notifVisible, setNotifVisible] = useState(true);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const visitorIdRef = useRef<string | null>(null);
  const mobile = useMobile();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(VISITOR_ID_KEY);
      if (stored) {
        visitorIdRef.current = stored;
        setVisitorId(stored);
      }
    } catch {
      // localStorage unavailable — server will issue a fresh visitor id
    }
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "bot",
        content:
          "Hello! I'm your assistant for Shree Manjunatha Engineering Works.\n\nAsk me about our services, materials, pricing, or how to get a free quote. How can I help you today?",
      },
    ]);
  }, []);

  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  function toggle() {
    setOpen((o) => !o);
    setNotifVisible(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput("");
    if (!chipsHidden) setChipsHidden(true);

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg, { role: "bot", content: "" }]);
    setLoading(true);
    setAwaitingFirstToken(true);

    function updateLastMessage(updater: (msg: Message) => Message) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = updater(next[next.length - 1]);
        return next;
      });
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (visitorIdRef.current) headers["x-visitor-id"] = visitorIdRef.current;

      const history = messages
        .slice(0, -1)
        .filter((m) => m.content.trim() !== "" && !m.action)
        .slice(-20)
        .map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch(`${CHAT_API}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: text,
          history,
          lead_captured: leadCapturedRef.current,
        }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const line = frame.trim();
          if (!line.startsWith("data:")) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;

          let evt: SSEEvent;
          try {
            evt = JSON.parse(jsonStr) as SSEEvent;
          } catch {
            continue;
          }

          if (evt.type === "visitor") {
            visitorIdRef.current = evt.visitor_id;
            setVisitorId(evt.visitor_id);
            try {
              localStorage.setItem(VISITOR_ID_KEY, evt.visitor_id);
            } catch {
              // ignore — visitor id just won't persist across sessions
            }
          } else if (evt.type === "text") {
            setAwaitingFirstToken(false);
            const chunk = evt.text;
            updateLastMessage((m) => ({ ...m, content: m.content + chunk }));
          } else if (evt.type === "action") {
            updateLastMessage((m) => ({
              ...m,
              content:
                m.content ||
                "Sure, drop your number and we'll call you with a free quote.",
              action: evt as ChatAction,
            }));
            if ((evt as ChatAction).action === "show_lead_form")
              setLeadCaptured(true);
            leadCapturedRef.current = true;
          } else if (evt.type === "error") {
            console.error("[ChatWidget] stream error:", evt.text);
            updateLastMessage(() => ({
              role: "bot",
              content: FALLBACK_MESSAGE,
            }));
          }
        }
      }
    } catch (err) {
      console.error("[ChatWidget] API error:", err);
      updateLastMessage(() => ({ role: "bot", content: FALLBACK_MESSAGE }));
    }
    setLoading(false);
    setAwaitingFirstToken(false);
  }

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={toggle}
        aria-label="Open chat assistant"
        style={{
          position: "fixed",
          bottom: mobile ? 16 : 28,
          right: mobile ? 16 : 28,
          width: mobile ? 54 : 62,
          height: mobile ? 54 : 62,
          borderRadius: "50%",
          background: GOLD,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(184,134,11,0.4)",
          zIndex: 9999,
          transition:
            "transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 10px 32px rgba(184,134,11,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 6px 24px rgba(184,134,11,0.4)";
        }}
      >
        {notifVisible && (
          <div
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: GOLD,
              border: "2px solid #fff",
              fontSize: 8,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            1
          </div>
        )}
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              fill="white"
              opacity="0.9"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div
        style={{
          position: "fixed",
          bottom: mobile ? 82 : 104,
          right: mobile ? 8 : 28,
          width: mobile ? "calc(100vw - 16px)" : 368,
          height: mobile ? "calc(100dvh - 100px)" : 560,
          maxHeight: "calc(100dvh - 200px)",
          background: "#fff",
          borderRadius: mobile ? 12 : 16,
          boxShadow: `0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px ${BORDER}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9998,
          transform: open
            ? "scale(1) translateY(0)"
            : "scale(0.85) translateY(20px)",
          transformOrigin: "bottom right",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition:
            "transform 0.3s cubic-bezier(.34,1.4,.64,1), opacity 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: DARK,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src="/smew-logo.png"
              alt="SMEW"
              width={36}
              height={36}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.2px",
              }}
            >
              SMEW Assistant
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                  animation: "smew-blink 2s infinite",
                }}
              />
              Online · Ready to help
            </div>
          </div>
          <button
            onClick={toggle}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.8)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={msgsRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#f8f7f4",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                animation: "smew-slide-up 0.25s ease forwards",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "Syne, sans-serif",
                  background: msg.role === "bot" ? DARK : "#e8d89a",
                  color: msg.role === "bot" ? "#fff" : DARK,
                  border: `2px solid ${BORDER}`,
                }}
              >
                {msg.role === "bot" ? "AI" : "You"}
              </div>
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius: 14,
                  fontSize: 13,
                  lineHeight: 1.65,
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  background: msg.role === "bot" ? "#fff" : DARK,
                  color: msg.role === "bot" ? "#1a1a1a" : "#fff",
                  border: msg.role === "bot" ? `1px solid ${BORDER}` : "none",
                  borderBottomLeftRadius: msg.role === "bot" ? 4 : 14,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 14,
                  boxShadow:
                    msg.role === "bot" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {msg.content}
                {msg.role === "bot" &&
                  msg.action?.action === "show_lead_form" &&
                  visitorId && (
                    <LeadForm
                      visitorId={visitorId}
                      service={msg.action.service}
                      notes={msg.action.notes}
                      location={msg.action.location}
                      name={msg.action.name}
                    />
                  )}
                {msg.role === "bot" &&
                  msg.action?.action === "show_whatsapp" && (
                    <WhatsAppButton url={msg.action.url} />
                  )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && awaitingFirstToken && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: DARK,
                  border: `2px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Syne, sans-serif",
                  flexShrink: 0,
                }}
              >
                AI
              </div>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  padding: "12px 16px",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#aaa",
                      animation: `smew-bounce 1.2s infinite ${j * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick chips */}
        {!chipsHidden && (
          <div
            style={{
              padding: "10px 16px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              background: "#f8f7f4",
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            {[
              "Our Services",
              "Get a Quote",
              "Materials Used",
              "How long does it take?",
              "Contact & Hours",
              "Custom Orders",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 11.5,
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 500,
                  color: DARK,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = DARK;
                  b.style.color = "#fff";
                  b.style.borderColor = DARK;
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "#fff";
                  b.style.color = DARK;
                  b.style.borderColor = BORDER;
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: `1px solid ${BORDER}`,
            background: "#fff",
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) send();
            }}
            placeholder="Ask about gates, grills, pricing…"
            disabled={loading}
            style={{
              flex: 1,
              background: "#f8f7f4",
              border: `1.5px solid ${BORDER}`,
              borderRadius: 22,
              padding: "9px 15px",
              fontSize: 13,
              color: DARK,
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              fontFamily: "DM Sans, sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = GOLD;
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(184,134,11,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = BORDER;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              background: input.trim() && !loading ? DARK : BORDER,
              color: "#fff",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !loading)
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "6px 0 10px",
            fontSize: 10,
            fontFamily: "Syne, sans-serif",
            color: "#aaa",
            background: "#fff",
          }}
        >
          Shree Manjunatha Engineering Works · Mysore
        </div>
      </div>

      <style>{`
        @keyframes smew-blink { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes smew-bounce {
          0%,60%,100% { transform:translateY(0); }
          30% { transform:translateY(-5px); }
        }
        @keyframes smew-slide-up {
          from { opacity:0; transform:translateY(8px); }
          to { opacity:1; transform:translateY(0); }
        }
        @media (max-width: 420px) {
          /* panel and bubble are positioned fixed; width adjusts below */
        }
      `}</style>
    </>
  );
}

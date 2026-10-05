"use client";
import { useRef, useState } from "react";
import { apiFetch } from "../lib/chat-api";
import { copy, type Language } from "../lib/chat-copy";

type Props = { sessionToken: string; language: Language; onSaved: () => void };
export default function LeadForm({ sessionToken, language, onSaved }: Props) {
  const t = copy[language];
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const requestId = useRef<string | null>(null);
  const busy = useRef(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy.current || !consent) return;
    let digits = phone.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91"))
      digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0"))
      digits = digits.slice(1);
    if (!/^[6-9]\d{9}$/.test(digits) || digits === "9986464819") {
      setError(t.invalid);
      return;
    }
    busy.current = true;
    setSubmitting(true);
    setError("");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await apiFetch("/lead", sessionToken, {
        method: "POST",
        body: JSON.stringify({
          request_id: requestId.current,
          phone: digits,
          name: name.trim() || null,
          consent: true,
        }),
      });
      if (!response.ok) {
        if (response.status === 409) requestId.current = null;
        throw new Error("Lead rejected");
      }
      const result = await response.json();
      if (!result.ok) throw new Error("Lead was not saved");
      setConfirmation(t.saved);
      onSaved();
    } catch {
      setError(t.submitError);
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }
  if (confirmation)
    return (
      <p className="smew-confirmation" role="status">
        ✓ {confirmation}
      </p>
    );
  return (
    <form onSubmit={submit} className="smew-lead-form">
      <label>
        {t.phone}
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={20}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
          required
        />
      </label>
      <label>
        {t.name}
        <input
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label className="smew-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={submitting}
          required
        />
        <span>{t.consent}</span>
      </label>
      {error && (
        <p className="smew-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={!consent || submitting}>
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}

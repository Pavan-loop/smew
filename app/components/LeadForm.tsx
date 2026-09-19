"use client";
import { useState } from "react";

const GOLD = "#b8860b";
const DARK = "#0f0f0f";
const BORDER = "#e4e0da";

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API;
const PHONE_RE = /^[6-9]\d{9}$/;

type LeadFormProps = {
  visitorId: string;
  service?: string;
  notes?: string;
  location?: string;
  name?: string;
};

export default function LeadForm({ visitorId, service, notes, location, name: initialName }: LeadFormProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(initialName ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!PHONE_RE.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${CHAT_API}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-visitor-id": visitorId },
        body: JSON.stringify({
          visitor_id: visitorId,
          phone,
          name: name.trim() || undefined,
          service,
          notes,
          location,
          consent: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message || "Something went wrong");
      setConfirmation(data.message || "Thanks! We'll call you back shortly.");
    } catch {
      setError("Couldn't submit — please call us at 9986464819 instead.");
    }
    setSubmitting(false);
  }

  if (confirmation) {
    return (
      <div
        style={{
          marginTop: 10,
          fontSize: 12.5,
          color: DARK,
          fontFamily: "DM Sans, sans-serif",
          lineHeight: 1.5,
        }}
      >
        ✓ {confirmation}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 10,
        border: `1px solid ${BORDER}`,
        background: "#f8f7f4",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <input
        type="tel"
        inputMode="numeric"
        placeholder="Your 10-digit mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        disabled={submitting}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: `1.5px solid ${BORDER}`,
          fontSize: 12.5,
          fontFamily: "DM Sans, sans-serif",
          color: DARK,
          outline: "none",
          background: "#fff",
        }}
      />
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: `1.5px solid ${BORDER}`,
          fontSize: 12.5,
          fontFamily: "DM Sans, sans-serif",
          color: DARK,
          outline: "none",
          background: "#fff",
        }}
      />
      {error && (
        <div style={{ fontSize: 11, color: "#c0392b", fontFamily: "DM Sans, sans-serif" }}>{error}</div>
      )}
      <div style={{ fontSize: 10.5, color: "#888", fontFamily: "DM Sans, sans-serif", lineHeight: 1.4 }}>
        We&apos;ll save your number to call you back about this enquiry.
      </div>
      <button
        type="submit"
        disabled={submitting || phone.length !== 10}
        style={{
          padding: "8px 14px",
          borderRadius: 20,
          border: "none",
          background: submitting || phone.length !== 10 ? BORDER : GOLD,
          color: "#fff",
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: 12,
          cursor: submitting || phone.length !== 10 ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Submitting…" : "Request Callback"}
      </button>
    </form>
  );
}

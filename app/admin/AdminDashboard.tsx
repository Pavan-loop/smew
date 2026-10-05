"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, responseError } from "../lib/chat-api";
import "./admin.css";

type Lead = {
  id: string;
  created: number;
  name: string | null;
  phone: string;
  service: string | null;
  notes: string;
  language: string;
  status: "new" | "contacted" | "closed";
  notification_status: "pending" | "sending" | "sent" | "dead";
  attempts: number;
  last_error: string | null;
  consent_at: number;
};
type Summary = {
  leads: number;
  open_leads: number;
  pending_notifications: number;
  failed_notifications: number;
  errors_24h: number;
  worker_healthy: boolean;
  daily_chat_limit: number;
  usage: { model: string; prompt_tokens: number; completion_tokens: number }[];
};

export default function AdminDashboard() {
  const [credential, setCredential] = useState("");
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    if (!token) return;
    const timeout = setTimeout(
      () => {
        setToken("");
        setSummary(null);
        setLeads([]);
        setError("Your admin session timed out. Sign in again.");
      },
      15 * 60 * 1000,
    );
    return () => clearTimeout(timeout);
  }, [token]);

  async function load(auth: string, pageOffset: number) {
    const [overview, list] = await Promise.all([
      apiFetch("/admin/summary", auth),
      apiFetch(`/admin/leads?limit=50&offset=${pageOffset}`, auth),
    ]);
    if (!overview.ok || !list.ok) {
      if (overview.status === 401 || list.status === 401) {
        setToken("");
        setSummary(null);
        setLeads([]);
      }
      throw new Error(await responseError(!overview.ok ? overview : list));
    }
    const [overviewData, listData] = await Promise.all([
      overview.json(),
      list.json(),
    ]);
    setSummary(overviewData);
    setLeads(listData.items);
    setTotal(listData.total);
    setOffset(pageOffset);
    setUpdated(new Date().toLocaleTimeString());
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await load(credential, 0);
      setToken(credential);
      setCredential("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  async function refresh(pageOffset = offset) {
    setBusy(true);
    setError("");
    try {
      await load(token, pageOffset);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load enquiries");
    } finally {
      setBusy(false);
    }
  }

  async function action(path: string, method: string, body?: object) {
    setBusy(true);
    setError("");
    try {
      const response = await apiFetch(path, token, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!response.ok) throw new Error(await responseError(response));
      await load(token, offset);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  async function download(path: string, filename: string) {
    setBusy(true);
    setError("");
    try {
      const response = await apiFetch(path, token);
      if (!response.ok) throw new Error(await responseError(response));
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="smew-admin">
      <header>
        <Link href="/">SMEW</Link>
        <span>Customer enquiries</span>
        {token && (
          <button
            onClick={() => {
              setToken("");
              setSummary(null);
              setLeads([]);
            }}
          >
            Sign out
          </button>
        )}
      </header>
      {!token ? (
        <section className="smew-admin-login">
          <p className="smew-admin-kicker">WORKSHOP ADMIN</p>
          <h1>Your enquiries, in one place.</h1>
          <p>
            Review callback requests and check whether Telegram notifications
            reached the workshop.
          </p>
          <form onSubmit={login}>
            <label htmlFor="admin-token">Admin access token</label>
            <input
              id="admin-token"
              type="password"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              autoComplete="off"
              required
            />
            <button type="submit" disabled={busy || !credential}>
              {busy ? "Checking…" : "Sign in"}
            </button>
          </form>
          <small>
            Your access token stays in this page&apos;s memory. The session
            clears after 15 minutes or when you reload.
          </small>
        </section>
      ) : (
        <>
          <section className="smew-admin-heading">
            <div>
              <p className="smew-admin-kicker">WORKSHOP ADMIN</p>
              <h1>Customer enquiries</h1>
              <p>Last refreshed {updated}. Refresh to see new requests.</p>
            </div>
            <button disabled={busy} onClick={() => void refresh()}>
              Refresh
            </button>
          </section>
          {summary && (
            <section className="smew-admin-stats" aria-label="Enquiry overview">
              {[
                ["Total enquiries", summary.leads],
                ["Need a callback", summary.open_leads],
                ["Telegram pending", summary.pending_notifications],
                ["Delivery failed", summary.failed_notifications],
              ].map(([label, value]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </section>
          )}
          <div className="smew-admin-tools">
            <span className={summary?.worker_healthy ? "healthy" : "unhealthy"}>
              {summary?.worker_healthy
                ? "Notification worker running"
                : "Notification worker paused / unhealthy"}
            </span>
            <span>{summary?.errors_24h ?? 0} errors in 24 hours</span>
            <button
              disabled={busy}
              onClick={() => void download("/admin/export", "smew-leads.csv")}
            >
              Export CSV
            </button>
            <button
              disabled={busy}
              onClick={() =>
                void download("/admin/backup", "smew-backup.sqlite3")
              }
            >
              Download backup
            </button>
          </div>
          <section className="smew-admin-list" aria-label="Callback requests">
            {!leads.length ? (
              <div className="smew-admin-empty">
                <h2>No enquiries yet</h2>
                <p>Saved callback requests will appear here.</p>
              </div>
            ) : (
              leads.map((lead) => (
                <article className="smew-admin-lead" key={lead.id}>
                  <div className="smew-admin-lead-top">
                    <div>
                      <h2>{lead.name || "Customer"}</h2>
                      <a href={`tel:+91${lead.phone}`}>+91 {lead.phone}</a>
                      <small>
                        {new Date(lead.created * 1000).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}{" "}
                        IST · {lead.language}
                      </small>
                    </div>
                    <span
                      className={`notification ${lead.notification_status}`}
                    >
                      {lead.notification_status === "sent"
                        ? "Telegram delivered"
                        : lead.notification_status === "dead"
                          ? "Delivery needs attention"
                          : "Telegram " + lead.notification_status}
                    </span>
                  </div>
                  <h3>{lead.service || "Callback enquiry"}</h3>
                  <p className="smew-admin-notes">
                    {lead.notes || "No additional details provided."}
                  </p>
                  <div className="smew-admin-lead-actions">
                    <label>
                      Status{" "}
                      <select
                        value={lead.status}
                        disabled={busy}
                        onChange={(e) =>
                          void action(`/admin/leads/${lead.id}`, "PATCH", {
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </label>
                    {lead.notification_status === "dead" && (
                      <button
                        disabled={busy}
                        onClick={() =>
                          void action(`/admin/leads/${lead.id}/retry`, "POST")
                        }
                      >
                        Retry Telegram
                      </button>
                    )}
                    <button
                      className="danger"
                      disabled={busy}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this enquiry and its conversation permanently? Telegram messages and downloaded backups must be deleted separately.",
                          )
                        )
                          void action(`/admin/leads/${lead.id}`, "DELETE");
                      }}
                    >
                      Delete enquiry
                    </button>
                  </div>
                  <small>
                    Contact consent recorded ·{" "}
                    {new Date(lead.consent_at * 1000).toLocaleDateString(
                      "en-IN",
                    )}{" "}
                    · Reference {lead.id.slice(0, 8)}
                  </small>
                  {lead.last_error && (
                    <p className="smew-admin-delivery-note">
                      Last delivery result: {lead.last_error} · {lead.attempts}{" "}
                      attempts
                    </p>
                  )}
                </article>
              ))
            )}
          </section>
          <nav className="smew-admin-pagination" aria-label="Enquiry pages">
            <button
              disabled={busy || offset === 0}
              onClick={() => void refresh(Math.max(0, offset - 50))}
            >
              Previous
            </button>
            <span>
              {total ? offset + 1 : 0}–{Math.min(offset + 50, total)} of {total}
            </span>
            <button
              disabled={busy || offset + 50 >= total}
              onClick={() => void refresh(offset + 50)}
            >
              Next
            </button>
          </nav>
          {summary && (
            <details className="smew-admin-usage">
              <summary>AI usage in the last 30 days</summary>
              <p>
                Daily chat request limit: {summary.daily_chat_limit}. Check
                actual charges and configure spending alerts in OpenAI and
                Railway.
              </p>
              {summary.usage.map((item) => (
                <p key={item.model}>
                  {item.model}: {item.prompt_tokens.toLocaleString()} input
                  tokens · {item.completion_tokens.toLocaleString()} output
                  tokens
                </p>
              ))}
            </details>
          )}
        </>
      )}
      {error && (
        <p className="smew-admin-error" role="alert">
          {error}
        </p>
      )}
      <footer>
        Callback preferences require human confirmation. Backups and exports
        contain private customer information.
      </footer>
    </main>
  );
}

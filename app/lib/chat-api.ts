const configuredBase = process.env.NEXT_PUBLIC_CHAT_API?.replace(/\/$/, "");
export const API_BASE = configuredBase ?? "http://localhost:8000";
export const SESSION_KEY = "smew_session_v2";

export async function apiFetch(
  path: string,
  token: string | null,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE}/api${path}`, {
    ...init,
    cache: "no-store",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    signal: init.signal ?? AbortSignal.timeout(20000),
  });
}

export async function responseError(response: Response): Promise<string> {
  const data = await response.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  return `Request failed (${response.status})`;
}

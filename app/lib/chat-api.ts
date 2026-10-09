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

export type RateLimit = "rateLimited" | "dailyLimit";

/** Why a request got 429: the backend's JSON `reason`, else Retry-After (over an hour means a daily cap). */
export async function rateLimitOf(
  response: Response,
): Promise<RateLimit | null> {
  if (response.status !== 429) return null;
  const body = await response
    .clone()
    .json()
    .catch(() => ({}));
  if (body?.reason === "daily_limit") return "dailyLimit";
  if (body?.reason === "rate_limited") return "rateLimited";
  const retryAfter = Number(response.headers.get("Retry-After"));
  return retryAfter > 3600 ? "dailyLimit" : "rateLimited";
}

export async function responseError(response: Response): Promise<string> {
  const data = await response.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  return `Request failed (${response.status})`;
}

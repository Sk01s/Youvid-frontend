import { store } from "@/lib/store";

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const token = store.getState().auth.token;
  const headers: Record<string, string> = {
    // only add JSON header when you're not sending FormData
    ...(init.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init.headers as Record<string, string>) ?? {}),
  };

  return fetch(input, {
    ...init,
    headers,
  });
}

import { authFetch } from "@/util/store";
import { AuthUser, ApiError } from "../types";
import { API_URL } from "../utils";

export async function loginApi(
  email: string,
  password: string,
  username?: string
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch(`${API_URL}/auth/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.message || "Login failed",
    } as ApiError;
  }
  return res.json();
}

export async function logoutApi(): Promise<void> {
  const res = await authFetch(`${API_URL}/auth/logout`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.message || "Logout failed",
    } as ApiError;
  }
}

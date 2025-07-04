// lib/api/auth.api.ts

import { AuthUser, ApiError } from "../types";
import { API_URL } from "../utils";

export async function loginApi(
  email: string,
  password: string,
  username?: string
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
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

export async function logoutApi(token: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.message || "Logout failed",
    } as ApiError;
  }
}

export async function verifyTokenApi(
  token: string
): Promise<{ user: AuthUser; token: string }> {
  const response = await fetch(`${API_URL}/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();

    throw {
      status: response.status,
      message: error.message || "Token verification failed",
    } as ApiError;
  }
  const data = await response.json();
  if (!data.id) {
    throw {
      status: 500,
      message: "Invalid response format",
    } as ApiError;
  }
  return data;
}

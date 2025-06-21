import { authFetch } from "@/util/store";
import { Category } from "../types";
import { API_URL } from "../utils";

export const getCategories = async (): Promise<Category[]> => {
  const res = await authFetch(`${API_URL}/categories`);
  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to get categories",
    };
  }
  const data = await res.json();
  return data;
};

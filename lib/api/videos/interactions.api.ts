// src/api/interaction.api.ts
import { ApiError } from "@/lib/types";
import { API_URL } from "@/lib/utils";
import { authFetch } from "@/util/store";

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw {
      status: response.status,
      message: errorData?.message || response.statusText,
    };
  }
  return response.json();
}

/**
 * Handle API errors
 */
function handleApiError(error: any): ApiError {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "message" in error
  ) {
    return error as ApiError;
  }
  return {
    status: 500,
    message: typeof error === "string" ? error : "Unknown error",
  };
}

/**
 * Toggle like status for a video
 */
export async function toggleLike(
  videoId: string
): Promise<{ isLiked: boolean }> {
  try {
    const response = await authFetch(
      `${API_URL}/video/interactions/${videoId}/like`,
      {
        method: "PUT",
      }
    );
    return handleResponse<{ isLiked: boolean }>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Toggle save status for a video
 */
export async function toggleSave(
  videoId: string
): Promise<{ isSaved: boolean }> {
  try {
    const response = await authFetch(
      `${API_URL}/video/interactions/${videoId}/save`,
      {
        method: "PUT",
      }
    );
    return handleResponse<{ isSaved: boolean }>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get all user interactions
 */
export async function getUserInteractions(): Promise<
  Record<string, { isLiked: boolean; isSaved: boolean }>
> {
  try {
    const response = await authFetch(`${API_URL}/video/interactions`);
    return handleResponse<
      Record<string, { isLiked: boolean; isSaved: boolean }>
    >(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get interaction status for a specific video
 */
export async function getVideoInteraction(
  videoId: string
): Promise<{ isLiked: boolean; isSaved: boolean }> {
  try {
    const interactions = await getUserInteractions();
    return interactions[videoId] || { isLiked: false, isSaved: false };
  } catch (error) {
    throw handleApiError(error);
  }
}

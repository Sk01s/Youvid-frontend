// src/api/comments.api.ts
import {
  ApiError,
  CommentInteraction,
  Comment as CommentType,
} from "@/lib/types";
import { API_URL } from "@/lib/utils";
import { authFetch } from "@/util/store";
import { mapToFrontend } from "../mappers";

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
 * Get comments for a video
 * @param videoId ID of the video
 * @returns Array of comments
 */
export async function getVideoComments(
  videoId: string
): Promise<CommentType[]> {
  try {
    const response = await authFetch(`${API_URL}/comments/video/${videoId}`);
    const data = (await handleResponse<CommentType[]>(response)).map(
      (comment) => mapToFrontend(comment)
    );

    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new comment
 * @param videoId ID of the video
 * @param text Comment content
 * @returns Created comment
 */
export async function createComment(
  videoId: string,
  text: string
): Promise<CommentType> {
  try {
    const response = await authFetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId, text }),
    });
    return handleResponse<CommentType>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update a comment
 * @param commentId ID of the comment
 * @param text New content
 * @returns Updated comment
 */
export async function updateComment(
  commentId: string,
  text: string
): Promise<CommentType> {
  try {
    const response = await authFetch(`${API_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    return handleResponse<CommentType>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a comment
 * @param commentId ID of the comment
 * @returns Success message
 */
export async function deleteComment(
  commentId: string
): Promise<{ message: string }> {
  try {
    const response = await authFetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
    });
    return handleResponse<{ message: string }>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Toggle like on a comment
 * @param commentId ID of the comment
 * @returns Updated interaction status
 */
export async function toggleCommentLike(
  commentId: string
): Promise<CommentInteraction> {
  try {
    const response = await authFetch(`${API_URL}/comments/${commentId}/like`, {
      method: "POST",
    });
    return mapToFrontend(handleResponse<CommentInteraction>(response));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Toggle dislike on a comment
 * @param commentId ID of the comment
 * @returns Updated interaction status
 */
export async function toggleCommentDislike(
  commentId: string
): Promise<CommentInteraction> {
  try {
    const response = await authFetch(
      `${API_URL}/comments/${commentId}/dislike`,
      {
        method: "POST",
      }
    );
    return handleResponse<CommentInteraction>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

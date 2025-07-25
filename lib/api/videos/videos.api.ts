import { mapToFrontend } from "@/lib/mappers";
import { ApiError, Video, VideoInteraction } from "@/lib/types";
import { API_URL } from "@/lib/utils";
import { authFetch } from "@/util/store";

export type ApiResponse<T> = {
  data: T;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

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
 * Fetch videos with optional filters (raw response)
 */
async function fetchVideos(
  page = 1,
  limit = 20,
  type?: "recommended" | "trending" | "subscriptions",
  category?: string,
  search?: string
): Promise<ApiResponse<Video[]>> {
  const url = new URL(`${API_URL}/videos`);
  url.searchParams.append("page", String(page));
  url.searchParams.append("limit", String(limit));
  if (type) url.searchParams.append("type", type);
  if (category) url.searchParams.append("category", category);
  if (search) url.searchParams.append("search", search);

  const response = await authFetch(url.toString());
  return handleResponse<ApiResponse<Video[]>>(response);
}

/**
 * Get videos with optional filters (returns paginated response)
 */
export async function getVideos(
  page = 1,
  limit = 20,
  type?: "recommended" | "trending" | "subscriptions",
  category?: string,
  search?: string
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  try {
    const res = await fetchVideos(page, limit, type, category, search);
    return {
      data: res.data.map((video) => mapToFrontend(video)),
      page: res.page,
      total: res.total,
      totalPages: res.totalPages,
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Search videos with full-text search capabilities
 * Returns paginated results with relevance-based ranking
 */
export async function searchVideos(
  searchTerm: string,
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  try {
    const url = new URL(`${API_URL}/videos`);
    url.searchParams.append("page", String(page));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("search", searchTerm);

    const response = await authFetch(url.toString());
    const res = await handleResponse<ApiResponse<Video[]>>(response);
    return {
      data: res.data.map((video) => mapToFrontend(video)),
      page: res.page,
      total: res.total,
      totalPages: res.totalPages,
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get recommended videos for the authenticated user
 */
export async function getRecommendedVideos(
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  return getVideos(page, limit, "recommended");
}

/**
 * Get trending videos (most popular)
 */
export async function getTrendingVideos(
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  return getVideos(page, limit, "trending");
}

/**
 * Get videos from subscribed channels
 */
export async function getSubscriptionVideos(
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  return getVideos(page, limit, "subscriptions");
}

/**
 * Get single video by ID
 */
export async function getVideo(id: number): Promise<Video> {
  try {
    const response = await authFetch(`${API_URL}/videos/${id}`);
    const data = await handleResponse<Video>(response);
    return mapToFrontend(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get videos for the authenticated user
 */
export async function getUserVideos(): Promise<Video[]> {
  try {
    const url = new URL(`${API_URL}/videos/user`);

    const response = await authFetch(url.toString());
    const data = await handleResponse<Video[]>(response);

    return data;
  } catch (error) {
    console.log(error);
    throw handleApiError(error);
  }
}

/**
 * Get videos for a specific channel
 */
export async function getChannelVideos(
  channelId = -1,
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  try {
    const url = new URL(`${API_URL}/videos/channel/${channelId}`);
    url.searchParams.append("page", String(page));
    url.searchParams.append("limit", String(limit));

    const response = await authFetch(url.toString());
    const res = await handleResponse<ApiResponse<Video[]>>(response);

    return {
      data: res.data.map((video) => mapToFrontend(video)),
      page: res.page,
      total: res.total,
      totalPages: res.totalPages,
    };
  } catch (error) {
    console.log(error);
    throw handleApiError(error);
  }
}

/**
 * Update video interaction (like/save)
 */
export async function updateVideoInteraction(
  videoId: string,
  interaction: Partial<VideoInteraction>
): Promise<VideoInteraction> {
  try {
    const response = await authFetch(
      `${API_URL}/videos/${videoId}/interaction`,
      {
        method: "PATCH",
        body: JSON.stringify(interaction),
        headers: { "Content-Type": "application/json" },
      }
    );

    return handleResponse<VideoInteraction>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get user's viewed videos
 */
export async function getUserViewedVideos(
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  try {
    const url = new URL(`${API_URL}/videos/user/viewed`);
    url.searchParams.append("page", String(page));
    url.searchParams.append("limit", String(limit));

    const response = await authFetch(url.toString());
    const res = await handleResponse<ApiResponse<Video[]>>(response);

    return {
      data: res.data.map((video) => mapToFrontend(video)),
      page: res.page,
      total: res.total,
      totalPages: res.totalPages,
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get user's liked videos
 */
export async function getLikedVideos(
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  try {
    const url = new URL(`${API_URL}/videos/user/liked`);
    url.searchParams.append("page", String(page));
    url.searchParams.append("limit", String(limit));

    const response = await authFetch(url.toString());
    const res = await handleResponse<ApiResponse<Video[]>>(response);

    return {
      data: res.data.map((video) => mapToFrontend(video)),
      page: res.page,
      total: res.total,
      totalPages: res.totalPages,
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get user's saved videos
 */
export async function getSavedVideos(
  page = 1,
  limit = 20
): Promise<{
  data: Video[];
  page: number;
  total: number;
  totalPages: number;
}> {
  try {
    const url = new URL(`${API_URL}/videos/user/saved`);
    url.searchParams.append("page", String(page));
    url.searchParams.append("limit", String(limit));

    const response = await authFetch(url.toString());
    const res = await handleResponse<ApiResponse<Video[]>>(response);

    return {
      data: res.data.map((video) => mapToFrontend(video)),
      page: res.page,
      total: res.total,
      totalPages: res.totalPages,
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

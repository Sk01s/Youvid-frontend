// src/api/subscription.api.ts
import { ApiError } from "@/lib/types";
import { API_URL } from "@/lib/utils";
import { authFetch } from "@/util/store";

/**
 * Toggle subscription status for a channel
 * @param channelId ID of the channel to subscribe/unsubscribe
 * @returns Object with new subscription status
 */
export const toggleSubscription = async (
  channelId: string
): Promise<{ isSubscribed: boolean }> => {
  try {
    const res = await authFetch(
      `${API_URL}/channels/${channelId}/subscription`,
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: err.error || err.message || "Failed to toggle subscription",
      };
    }

    return await res.json();
  } catch (error) {
    throw {
      status: 500,
      message: "Network error occurred while toggling subscription",
      ...(error as object),
    } as ApiError;
  }
};

/**
 * Get subscription status for a channel
 * @param channelId ID of the channel to check
 * @returns Object with subscription status
 */
export const getSubscriptionStatus = async (
  channelId: string
): Promise<{ isSubscribed: boolean }> => {
  try {
    const res = await authFetch(
      `${API_URL}/channels/${channelId}/subscription`
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message:
          err.error || err.message || "Failed to get subscription status",
      };
    }
    return await res.json();
  } catch (error) {
    throw {
      status: 500,
      message: "Network error occurred while fetching subscription status",
      ...(error as object),
    } as ApiError;
  }
};

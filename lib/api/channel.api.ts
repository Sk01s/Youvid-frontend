// src/api/channel.api.ts

import { authFetch } from "@/util/store";
import { Channel } from "../types";
import { API_URL } from "../utils";

/**
 * Helper to map raw channel payload to our frontend Channel shape.
 * Note: backend `id` is a number, frontend expects string.
 */
function mapChannel(raw: any): Channel {
  return {
    id: String(raw.id),
    name: raw.name,
    avatar: raw.avatar,
    subscribers: raw.subscribers,
    verified: raw.verified,
  };
}

/**
 * GET /api/channels/:id
 */
export async function getChannelById(id: number): Promise<Channel> {
  const res = await authFetch(`${API_URL}/channels/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to fetch channel",
    };
  }

  const data = await res.json();
  return mapChannel(data);
}

/**
 * GET /api/channels/user/:userId
 */
export async function getChannelByUserId(userId: string): Promise<Channel[]> {
  const res = await authFetch(`${API_URL}/channels/user/${userId}`, {
    method: "GET",
  });

  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to fetch user channels",
    };
  }

  const data: any[] = await res.json();
  return data.map(mapChannel);
}
/**
 * GET /api/channels/user/
 */
export async function getChannelsForUserId(): Promise<Channel[]> {
  const res = await authFetch(`${API_URL}/channels/user/`, {
    method: "GET",
  });

  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to fetch user channels",
    };
  }

  const data: any[] = await res.json();
  return data.map(mapChannel);
}

/**
 * POST /api/channels
 */
export async function createChannel(
  userId: number,
  name: string,
  avatar: string,
  subscribers?: number,
  verified?: boolean
): Promise<Channel> {
  const payload = {
    user_id: userId,
    name,
    avatar,
    // only include these if provided
    ...(subscribers !== undefined && { subscribers }),
    ...(verified !== undefined && { verified }),
  };

  const res = await authFetch(`${API_URL}/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to create channel",
    };
  }

  const data = await res.json();
  return mapChannel(data);
}

/**
 * PUT /api/channels/:id
 */
export async function updateChannel(
  id: number,
  updateData: {
    name?: string;
    avatar?: string;
    subscribers?: number;
    verified?: boolean;
  }
): Promise<Channel> {
  const res = await authFetch(`${API_URL}/channels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to update channel",
    };
  }

  const data = await res.json();
  return mapChannel(data);
}

/**
 * DELETE /api/channels/:id
 * (optional — only if you implement a destroy endpoint)
 */
export async function deleteChannel(id: number): Promise<void> {
  const res = await authFetch(`${API_URL}/channels/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw {
      status: res.status,
      message: err.error || err.message || "Failed to delete channel",
    };
  }
}

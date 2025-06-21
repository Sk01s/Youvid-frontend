import { Video } from "@/lib/types";
import { API_URL } from "@/lib/utils";
import { authFetch } from "@/util/store";
import axios from "axios";

// Fetch user's uploaded videos
export const fetchMyVideos = async (): Promise<Video[]> => {
  const res = await authFetch(`${API_URL}/videos/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "My Videos failed to fetch  failed");
  }

  return (await res.json()) as Video[];
};

// Upload new video
export const uploadVideo = async (formData: FormData): Promise<Video> => {
  const res = await authFetch(`${API_URL}/videos/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Video upload failed");
  }

  return (await res.json()) as Video;
};

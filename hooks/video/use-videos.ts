// lib/hooks/useVideos.ts
import { useQuery } from "@tanstack/react-query";
import type { Video } from "@/lib/types";

export function useVideos(
  queryKey: (string | number)[],
  fetcher: () => Promise<Video[]>
) {
  const { data, isLoading, isError } = useQuery<Video[], Error>({
    queryKey: [...queryKey],
    queryFn: fetcher,
    staleTime: 1000 * 60 * 5,
  });

  return { videos: data, isLoading, isError };
}

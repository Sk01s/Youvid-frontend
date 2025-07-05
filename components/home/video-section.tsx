"use client";

import { FC, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import VideoGrid from "@/components/home/video-grid";
import { useInfiniteQuery, QueryKey } from "@tanstack/react-query";
import VideoCardSkeleton from "./video-card-skeleton";

interface VideoSectionProps {
  title?: string;
  queryKey: (string | number)[];
  fetcher: (
    page: number,
    limit: number
  ) => Promise<{
    data: any[];
    page: number;
    total: number;
    totalPages: number;
  }>;
  initialPage?: number;
  itemsPerPage?: number;
}

type FetcherResponse = {
  data: any[];
  page: number;
  total: number;
  totalPages: number;
};

const VideoSection: FC<VideoSectionProps> = ({
  title,
  queryKey,
  fetcher,
  initialPage = 1,
  itemsPerPage = 6,
}) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery<FetcherResponse>({
    queryKey: ["videoSection", ...queryKey] as QueryKey,
    queryFn: async ({ pageParam }) => {
      return fetcher(pageParam as number, itemsPerPage);
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });

  // Flatten all pages into a single video array
  const videos = data?.pages.flatMap((page) => page.data) || [];

  // Setup intersection observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <section className="mb-8">
      {title && (
        <h2
          className={`text-xl md:text-2xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
      )}

      {isError && (
        <div className="text-center py-6">
          <p className="text-red-500 mb-4">
            Failed to load {title?.toLowerCase()}.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Initial loading state - shows skeleton grid */}
      {(isLoading || isRefetching) && videos.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <VideoCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Main content when we have videos */}
      {videos.length > 0 && (
        <>
          <VideoGrid videos={videos} isLoading={false} />

          {/* Loading spinner for subsequent pages */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                  theme === "dark" ? "border-white" : "border-gray-900"
                }`}
              ></div>
            </div>
          )}

          {/* End of content message */}
          {!hasNextPage && videos.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              You've reached the end of the list
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!isLoading && !isRefetching && videos.length === 0 && !isError && (
        <div className="text-center py-6 text-gray-500">No videos found</div>
      )}

      {/* Sentinel element for infinite scroll */}
      {hasNextPage && !isError && (
        <div ref={sentinelCallback} className="h-1 w-full" />
      )}
    </section>
  );
};

export default VideoSection;

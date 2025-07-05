"use client";

import { useSearchParams } from "next/navigation";
import VideoSection from "@/components/home/video-section";
import { searchVideos } from "@/lib/api/videos/videos.api";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  // Update searchQuery when URL changes
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <main className="flex-1 max-h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 transition-all duration-300 h-[100vh]">
      {!searchQuery ? (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Search Videos</h1>
          <p className="text-gray-600">
            Enter a search term in the search bar above
          </p>
        </div>
      ) : (
        <VideoSection
          title={`Search Results for "${searchQuery}"`}
          queryKey={["search-videos", searchQuery]}
          fetcher={(page, limit) => searchVideos(searchQuery, page, limit)}
        />
      )}
    </main>
  );
}

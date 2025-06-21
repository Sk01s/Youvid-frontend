"use client";

import type React from "react";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-4 pr-12 py-3 text-lg rounded-full border-2 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-zinc-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500"
            }`}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className={`rounded-full p-3 ${
            theme === "dark"
              ? "border-gray-600 bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              : "border-gray-300 bg-white text-gray-600 hover:bg-zinc-50"
          }`}
        >
          <Mic className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

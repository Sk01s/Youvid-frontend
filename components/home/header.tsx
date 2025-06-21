"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { toggleTheme } from "@/lib/features/theme-slice";
import { Menu, Sun, Moon, User, Bell, Search, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar?: () => void;
}) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setShowMobileSearch(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-10 border-b transition-colors duration-300 ${
        theme === "dark"
          ? "bg-zinc-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          className={`fixed inset-0 z-50  flex pt-10 px-4 bg-opacity-75 ${
            theme === "dark" ? "bg-zinc-900" : "bg-white"
          }`}
        >
          <div className="flex w-full ">
            <Button
              variant="default"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className={`mr-2 ${
                theme === "dark"
                  ? "text-white border-gray-700"
                  : "text-gray-900 border-gray-200"
              }`}
            >
              <X className="h-5 w-5" />
            </Button>
            <form onSubmit={handleSearch} className="flex-1 flex">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={`rounded-r-none ${
                  theme === "dark"
                    ? "bg-zinc-800 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              />
              <Button
                type="submit"
                className={`rounded-l-none px-4 ${
                  theme === "dark"
                    ? "bg-zinc-700 border-gray-700 hover:bg-zinc-600"
                    : "bg-zinc-100 border-gray-300 hover:bg-zinc-200"
                }`}
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Menu and Logo */}
          <div className="flex items-center space-x-4">
            {toggleSidebar && (
              <Button
                variant="default"
                size="icon"
                onClick={toggleSidebar}
                className={`md:hidden rounded-full ${
                  theme === "dark"
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link href={"/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YV</span>
              </div>
              <span
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                YouVid
              </span>
            </Link>
          </div>

          {/* Center Section: Search Bar (Desktop) */}
          <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-12 rounded-full ${
                  theme === "dark"
                    ? "bg-zinc-800 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className={`absolute right-1 top-[5%] h-[90%] rounded-full ${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                    : "bg-zinc-100 hover:bg-zinc-200 text-gray-600"
                }`}
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(true)}
              className={`md:hidden rounded-full ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-zinc-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-zinc-100"
              }`}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTheme())}
              className={`rounded-full ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-zinc-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-zinc-100"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-zinc-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-zinc-100"
              }`}
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <Link
              href={"/auth"}
              className={`rounded-full ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-zinc-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-zinc-100"
              }`}
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

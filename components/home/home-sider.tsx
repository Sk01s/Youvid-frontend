"use client";
import { RootState } from "@/lib/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./sidebar";
import Header from "./header";

const HomeSider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div
      className={`max-h-screen transition-colors duration-300 flex flex-col ${
        theme === "dark" ? "bg-zinc-900" : "bg-zinc-50"
      }`}
    >
      <Header toggleSidebar={toggleSidebar} />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {children}
      </div>
    </div>
  );
};

export default HomeSider;

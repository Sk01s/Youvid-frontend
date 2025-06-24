"use client"; // Add this at the top

import Header from "@/components/home/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { selectAuth } from "@/lib/features/auth-slice";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSelector((state: RootState) => state.theme.mode);

  const isDark = theme === "dark";

  return (
    <section className="flex min-h-screen">
      <div
        className={`flex-1 flex flex-col ${
          isDark ? "bg-zinc-900 text-zinc-50" : "bg-zinc-50 text-zinc-800"
        }`}
      >
        <Header />
        {children}
      </div>
    </section>
  );
}

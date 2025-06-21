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
  const router = useRouter();
  const authState = useSelector(selectAuth);
  const theme = useSelector((state: RootState) => state.theme.mode);

  const isDark = theme === "dark";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.loading && !authState.user) {
      router.push("/auth");
    }
  }, [authState.user, authState.loading, router]);

  // Show loading state while checking auth
  if (authState.loading || !authState.user) {
    return (
      <div
        className={`flex min-h-screen w-full items-center justify-center ${
          isDark ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

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

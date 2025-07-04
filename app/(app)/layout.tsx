"use client";

import Header from "@/components/home/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { selectAuth, verifyToken } from "@/lib/features/auth-slice";
import Loading from "../loading";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector(selectAuth);
  const theme = useSelector((state: RootState) => state.theme.mode);

  const isDark = theme === "dark";

  useEffect(() => {
    if (!authState.verifying && authState.token) {
      dispatch(verifyToken());
    }
  }, []);

  // After verification completes: if still no user, redirect to login
  useEffect(() => {
    if (!authState.verifying && !authState.user && !authState.loading) {
      router.push("/auth");
    }
  }, [authState.user, authState.verifying, authState.loading, router]);

  // Show spinner while loading or verifying, or until user is set
  if (authState.loading || authState.verifying || !authState.user) {
    return (
      <div
        className={`flex min-h-screen w-full items-center justify-center ${
          isDark ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}

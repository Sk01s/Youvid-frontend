"use client";
import Header from "@/components/home/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import authSlice, {
  selectAuth,
  selectAuthVerifying,
  verifyToken,
  clearError,
} from "@/lib/features/auth-slice";
import type { AppDispatch } from "@/lib/store";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuth);
  const verifying = useSelector(selectAuthVerifying);

  // Verify token on mount
  useEffect(() => {
    if (auth.token) {
      dispatch(verifyToken());
    } else {
      // Clear any existing errors if no token
      dispatch(clearError());
    }
  }, [auth.token, dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (!verifying && auth.user && auth.token) {
      router.back();
    }
  }, [verifying, auth.user, auth.token, router]);

  // Show loader while verifying
  if (verifying || (auth.token && !auth.user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Verifying session...</div>
      </div>
    );
  }

  // Render home layout if not authenticated
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}

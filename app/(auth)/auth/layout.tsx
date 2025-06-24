"use client";
import Header from "@/components/home/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authenticate } from "@/lib/api/auth.api";
import { useSelector } from "react-redux";
import { selectAuth } from "@/lib/features/auth-slice";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector(selectAuth);
  // Verify token using React Query
  const { data, isPending } = useQuery({
    queryKey: ["auth-verify", user.token],
    queryFn: authenticate,
    retry: false,
  });

  // Redirect if authenticated
  useEffect(() => {
    if (data?.id) {
      router.back();
    }
  }, [data, router]);

  // Show loader while verifying token
  if (isPending) {
    return <div>Loading...</div>;
  }

  // Render home layout if not authenticated
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}

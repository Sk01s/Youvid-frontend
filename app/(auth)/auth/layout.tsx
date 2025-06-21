"use client";
import Header from "@/components/home/header";
import HomeSider from "@/components/home/home-sider";
import { selectAuth } from "@/lib/features/auth-slice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inside LoginForm component:
  const router = useRouter();

  const authState = useSelector(selectAuth);

  useEffect(() => {
    if (authState.token) {
      router.push("/profile");
    }
  }, [authState.user, router]);
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}

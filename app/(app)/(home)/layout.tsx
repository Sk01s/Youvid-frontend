import HomeSider from "@/components/home/home-sider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeSider>{children}</HomeSider>;
}

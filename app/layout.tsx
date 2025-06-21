import "./globals.css";
import Providers from "@/components/home/providers";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YouVid - Your Video Platform",
  description:
    "Discover, watch, and share amazing videos from creators around the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

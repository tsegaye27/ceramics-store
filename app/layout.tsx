import type { Metadata } from "next";
import "./globals.css";
import RLayout from "@/app/_layouts/RLayout";

export const metadata: Metadata = {
  title: "Ceramics Store",
  description: "Explore unique ceramics crafted with care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RLayout>{children}</RLayout>;
}

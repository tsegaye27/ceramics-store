import type { Metadata } from "next";
import "./globals.css";
import RLayout from "@/app/_layouts/RLayout";

export const metadata: Metadata = {
  title: "Ceramics Store",
  description: "Manage you ceramics on a higher level.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RLayout>{children}</RLayout>;
}

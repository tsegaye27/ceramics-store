import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import { LanguageProvider } from "./_context/LanguageContext";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ceramics Store",
  description: "Explore unique ceramics crafted with care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <ReduxProvider>
          <AuthProvider>
            <LanguageProvider>
              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </LanguageProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

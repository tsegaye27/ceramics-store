import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import { LanguageProvider } from "./_context/LanguageContext";
import ReduxProvider from "./ReduxProvider";

export const metadata: Metadata = {
  title: "Ceramics Store",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

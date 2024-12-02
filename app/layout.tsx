import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import { LanguageProvider } from "./_context/LanguageContext";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "react-hot-toast";

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
    <html>
      <body>
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

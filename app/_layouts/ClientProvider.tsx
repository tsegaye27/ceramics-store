"use client";

import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { useAuth } from "@/app/_context/AuthContext";
import { LanguageProvider } from "../_context/LanguageContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const token = auth?.token;
  const isTokenValid = auth?.isTokenValid;
  const logout = auth?.logout;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (token && isTokenValid && isTokenValid()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token, isTokenValid]);

  return (
    <LanguageProvider>
      <div className="p-6 bg-blue-50 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <LanguageSwitcher />
          <div>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-700 font-bold"
              >
                Login
              </Link>
            )}
          </div>
        </header>
        <main>{children}</main>
      </div>
    </LanguageProvider>
  );
}

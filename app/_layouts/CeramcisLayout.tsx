"use client";

import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { useLanguage } from "../_context/LanguageContext";
import Link from "next/link";
import { useAuth } from "../_context/AuthContext";

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const user = isAuthenticated ? JSON.parse(localStorage.getItem("user")!) : {};
  const { name } = user;

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <LanguageSwitcher />
        <div>
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              {name} - {t("logout")}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-700 font-bold"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

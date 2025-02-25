"use client";

import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { useLanguage } from "../_context/LanguageContext";
import { useAuth } from "../_context/AuthContext";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, token, user } = useAuth();
  const { t } = useLanguage();
  const name = user?.name;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = () => {
    startTransition(() => {
      router.push("/login");
    });
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
          <header className="flex justify-between items-center mb-6">
            <LanguageSwitcher />
            <div>
              {token && user ? (
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  {name} - {t("logout")}
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="text-blue-500 hover:text-blue-700 font-bold"
                >
                  {t("login")}
                </button>
              )}
            </div>
          </header>
          <main>{children}</main>
        </>
      )}
    </div>
  );
}

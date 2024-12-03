"use client";

import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "../_context/LanguageContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import axiosInstance from "../_lib/axios";
import { login } from "@/app/_store/userSlice";

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, logout, isTokenValid } = useAuth();
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      if (!token || !isTokenValid || !isTokenValid()) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const res = await axiosInstance.get("/users/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(login(res.data));
        setName(res.data.user.name);
      } catch (err: any) {
        setIsAuthenticated(false);
      }
    }

    fetchUser();
  }, [token, isTokenValid, dispatch]);

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

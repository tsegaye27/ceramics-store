"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axiosInstance from "../_lib/axios";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const { token, user, login } = useAuth();
  const router = useRouter();
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    const checkAndRefreshToken = async () => {
      try {
        if (!token) return;
        await axiosInstance.get("/auth/verify");

        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expiresAt = tokenData.exp * 1000;
        const timeBeforeExpiry = expiresAt - Date.now();

        if (timeBeforeExpiry < 3600000) {
          const { data } = await axiosInstance.post("/auth/refresh", {
            userId: user?.id,
          });
          login(user, data.token);
        }
      } catch (error) {
        router.replace("/login");
      }
    };

    if (token) {
      checkAndRefreshToken();
      refreshInterval = setInterval(checkAndRefreshToken, 1800000);
    }

    return () => clearInterval(refreshInterval);
  }, [token, router, user?.id, login, user]);
  return <>{children}</>;
};

export default AuthChecker;

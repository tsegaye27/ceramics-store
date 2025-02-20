"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axiosInstance from "../_lib/axios";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    async function isTokenValid() {
      try {
        await axiosInstance.get("/auth/verify");
      } catch (error) {
        router.push("/login");
      }
    }
    if (token) {
      isTokenValid();
    }
  }, [token, router]);
  return <>{children}</>;
};

export default AuthChecker;

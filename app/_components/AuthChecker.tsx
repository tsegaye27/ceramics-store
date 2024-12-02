"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const authContext = useAuth();
  const isTokenValid = authContext?.isTokenValid;
  const router = useRouter();

  useEffect(() => {
    if (isTokenValid && !isTokenValid()) {
      router.push("/login");
    }
  }, [isTokenValid, router]);

  return <>{children}</>;
};

export default AuthChecker;

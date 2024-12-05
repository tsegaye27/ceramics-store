"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCookies } from "react-cookie";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  cookies: { token?: string; expirationTime?: string };
  setCookie: (
    name: string,
    value: string,
    options?: { path?: string; maxAge?: number; secure?: boolean }
  ) => void;
  removeCookie: (
    name: "token" | "expirationTime",
    options?: { path?: string }
  ) => void;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies<string>([
    "token",
    "expirationTime",
  ]);

  const token = cookies.token || null;
  const expirationTime = cookies.expirationTime
    ? Number(cookies.expirationTime)
    : null;

  const login = (newToken: string) => {
    const newExpirationTime = Date.now() + 60 * 60 * 24 * 1000; // 24 hours
    setCookie("token", newToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    setCookie("expirationTime", newExpirationTime.toString(), {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    removeCookie("expirationTime", { path: "/" });
  };

  const isTokenValid = () => {
    return Boolean(token && expirationTime && Date.now() < expirationTime);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        cookies,
        setCookie,
        removeCookie,
        isTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

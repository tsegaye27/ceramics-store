"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCookies } from "react-cookie";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  cookies: { token?: string };
  setCookie: (
    name: "token",
    value: string,
    options?: { path?: string; maxAge?: number; secure?: boolean }
  ) => void;
  removeCookie: (
    name: "token",
    options?: { path?: string; maxAge?: number; secure?: boolean }
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies<
    "token",
    { token?: string }
  >(["token"]);
  const token = cookies.token || null;

  const login = (newToken: string) => {
    setCookie("token", newToken, {
      path: "/",
      maxAge: 604800,
    });
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, cookies, setCookie, removeCookie }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

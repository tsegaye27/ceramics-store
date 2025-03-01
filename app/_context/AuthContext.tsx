"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setToken,
  logout as clearAuth,
} from "@/app/_features/auth/slice";
import { RootState } from "../_features/store/store";
import { useCookies } from "react-cookie";

type AuthContextType = {
  token: string | null;
  user: any | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  useEffect(() => {
    const storedToken = cookies.jwt;
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      dispatch(setToken(storedToken));
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [cookies, dispatch]);

  const login = (user: any, token: string) => {
    setCookie("jwt", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(setToken(token));
    dispatch(setUser(user));
  };

  const logout = () => {
    removeCookie("jwt");
    localStorage.removeItem("user");
    dispatch(clearAuth());
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
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

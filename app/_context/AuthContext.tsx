"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  setUser,
  setToken,
  logout as clearAuth,
} from "@/app/_features/auth/slice";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../_features/store/store";
import { useCookies } from "react-cookie";
import axiosInstance from "../_lib/axios";

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
  const [isLoading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { token, user, loading } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const login = (user: any, token: string) => {
    setCookie("jwt", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(setToken(token));
    dispatch(setUser(user));
  };

  const logout = useCallback(() => {
    removeCookie("jwt");
    localStorage.removeItem("user");
    dispatch(clearAuth());
  }, [dispatch, removeCookie]);

  useEffect(() => {
    const storedToken = cookies.jwt;
    const storedUser = localStorage.getItem("user");

    const validateToken = async () => {
      if (storedToken) {
        try {
          const response = await axiosInstance.get("/auth/verify", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          const { valid } = await response.data;

          if (valid) {
            dispatch(setToken(storedToken));
            if (storedUser) {
              dispatch(setUser(JSON.parse(storedUser)));
            }
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [cookies.jwt, dispatch, logout]);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading: isLoading || loading }}
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

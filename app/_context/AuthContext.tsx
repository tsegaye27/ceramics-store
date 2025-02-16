"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { RootState, useAppSelector } from "../_features/store/store";
import { IUser } from "../_types/types";

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const { user, token } = useAppSelector((state: RootState) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.jwt);
  useEffect(() => {
    if (cookies.jwt) {
      setIsAuthenticated(true);
    }
  }, [cookies.jwt]);

  const login = async () => {
    console.log(user, token);
    localStorage.setItem("user", JSON.stringify(user));
    setCookie("jwt", token, { path: "/" });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    removeCookie("jwt");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
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

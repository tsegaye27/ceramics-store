"use client";
import { useAuth } from "@/app/_context/AuthContext";
import { login } from "@/app/_features/auth/slice";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import { setCookie } from "@/app/_lib/cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { login: loginContext } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        login({
          email: loginData.email,
          password: loginData.password,
        }),
      ).unwrap();
      loginContext(response.data.user, response.data.token);
      toast.success("Login successful!");
      router.push("/ceramics");
    } catch (err: any) {
      toast.error(err || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg ring-1 ring-blue-500 flex flex-col items-center gap-6 py-8 px-6 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-blue-600">Login</h2>
        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded-lg w-full text-center">
            {error}
          </p>
        )}
        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="Email"
          disabled={loading}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
        />
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Password"
          disabled={loading}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500"
          } text-white rounded-lg`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

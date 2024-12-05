"use client";

import axiosInstance from "@/app/_lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/login", formData);
      const { token } = data;

      if (token && login) {
        login(token);
        setSuccess("Logged in successfully!");
        setTimeout(() => router.push("/ceramics"), 1000);
      } else {
        throw new Error("No token received from server.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
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
        {success && (
          <p className="text-green-500 bg-green-100 p-2 rounded-lg w-full text-center">
            {success}
          </p>
        )}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          disabled={loading}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
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

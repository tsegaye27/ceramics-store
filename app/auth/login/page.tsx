"use client";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      login(token);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg ring-1 ring-blue-500 flex flex-col items-center gap-6 py-8 px-6 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-blue-600">Login</h2>

        <div className="w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
        >
          Login
        </button>

        <p className="text-sm text-gray-500">
          Do not have an account?
          <Link href={"/auth/signup"} className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

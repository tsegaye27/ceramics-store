"use client";
import axiosInstance from "@/app/_lib/axios";
import Link from "next/link";
import React, { useState } from "react";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Account created successfully! Please log in.");
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.response.data.error || "Internal server error");
    } finally {
      setLoading(false);

      if (error) {
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg ring-1 ring-blue-500 flex flex-col items-center gap-6 py-8 px-6 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-blue-600">Sign up</h2>

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

        <div className="w-full">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
            disabled={loading}
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out`}
          disabled={loading}
        >
          <Link href="/login">{loading ? "Signing up..." : "Sign up"}</Link>
        </button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;

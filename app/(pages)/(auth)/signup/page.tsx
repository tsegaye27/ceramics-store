"use client";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { signup } from "@/app/_features/auth/slice";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/_lib/cookie";

const SignUpPage: React.FC = () => {
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const [signupData, setSignupData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== passwordConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await dispatch(
        signup({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      ).unwrap();
      setCookie("jwt", response.data.token, 1);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Signup successful!");
      router.push("/ceramics");
    } catch (err: any) {
      toast.error(err || "Signup failed!");
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
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={signupData.name}
          onChange={handleChange}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupData.email}
          onChange={handleChange}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupData.password}
          onChange={handleChange}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
          disabled={loading}
        />
        <input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full py-3 ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500"
          } text-white rounded-lg`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;

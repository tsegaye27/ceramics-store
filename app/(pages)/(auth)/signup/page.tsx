"use client";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import React, { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { signup } from "@/app/_features/auth/slice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import { Loader } from "@/app/_components/Loader";

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
  const { login } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };
  const handleNavigate = (route: string) => {
    startTransition(() => {
      router.push(route);
    });
  };

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
      login(response.data.user, response.data.token);
      toast.success("Signup successful!");
      response.data.user.role === "admin"
        ? handleNavigate("/")
        : handleNavigate("/ceramics");
    } catch (err: any) {
      toast.error(err || "Signup failed!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {isPending ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg ring-1 ring-blue-500 flex flex-col items-center gap-4 py-6 px-4 sm:px-6 rounded-xl w-full max-w-sm sm:max-w-md"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600">
              Sign up
            </h2>
            <div className="flex flex-col w-full gap-1">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupData.name}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
                disabled={loading}
              />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full p-2 sm:p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 bg-blue-50"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 sm:py-3 ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500"
              } text-white rounded-lg`}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => handleNavigate("/login")}
                className="text-blue-500 bg-transparent hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUpPage;

import Link from "next/link";
import React from "react";

const SignUpPage: React.FC = () => {
  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (!name || !email || !password || !passwordConfirm) {
      return "Missing fields";
    }
    if (password !== passwordConfirm) {
      return "Passwords do not match";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <form
        action={handleSubmit}
        className="bg-white shadow-lg ring-1 ring-blue-500 flex flex-col items-center gap-6 py-8 px-6 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-blue-600">Sign up</h2>

        <div className="w-full">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            className="block w-full p-3 ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg mb-4 transition-all duration-200 ease-in-out bg-blue-50"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
        >
          Sign up
        </button>
        <p className="text-sm text-gray-500">
          Do not have an account?
          <Link href={"/login"} className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;

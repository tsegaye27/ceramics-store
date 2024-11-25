import Link from "next/link";
import React from "react";

const LoginPage: React.FC = () => {

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
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
        >
          Login
        </button>
        <p className="text-sm text-gray-500">
          Do not have an account?
          <Link href={"/signup"} className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

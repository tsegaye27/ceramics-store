"use client";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="ring-[0.05rem] h-[300px] ring-blue-500 flex rounded-lg justify-start items-center gap-8 py-8 flex-col w-[400px]"
      >
        <h2 className="text-4xl text-blue-500 text-center w-full">Login</h2>
        <div className="flex flex-col w-full items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-3 p-2 w-[300px] ring-[0.05rem] ring-blue-500 outline-none text-[#414141] rounded-md
          "
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="mb-3 w-[300px] p-2 ring-[0.05rem] ring-blue-500 outline-none text-[#414141] rounded-md
          "
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 w-1/4 rounded-lg text-white cursor-pointer border-none"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

"use client";
import React from "react";

interface ErrorProps {
  error: Error | null;
  reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-lg ring-1 ring-blue-500 flex flex-col items-center gap-6 py-8 px-6 rounded-2xl w-fit max-w-md">
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
        <button onClick={reset}>Try Again</button>
      </div>
    </div>
  );
};

export default Error;

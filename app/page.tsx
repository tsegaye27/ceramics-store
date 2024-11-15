import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">
          Welcome to the Ceramics Store
        </h1>
        <Link href="/ceramics">
          <button className="px-6 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            View Ceramics
          </button>
        </Link>
      </div>
    </main>
  );
}

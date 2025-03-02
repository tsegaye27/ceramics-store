'use client'
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader } from "./_components/Loader";

export default function NotFound() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleNavigate = () => {
    startTransition(() => {
      router.push("/ceramics")
    })
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {isPending ? <Loader /> : <>
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-6">Sorry, the page you’re looking for doesn’t exist.</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleNavigate}
        >
        Go back
      </button>
      </>}
    </div>
  );
}

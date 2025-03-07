"use client";
import { useEffect } from "react";
import { useAuth } from "./_context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader } from "./_components/Loader";

const HomePage = () => {
  const { token, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token && !loading) {
      router.push("/login");
      return;
    } else if (user.role === "admin") {
      router.push("/dashboard");
      return;
    } else if (user.role === "user") {
      router.push("/ceramics");
      return;
    }
  }, [token, user, router, loading]);

  return <Loader />;
};

export default HomePage;

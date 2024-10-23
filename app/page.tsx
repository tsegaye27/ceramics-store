"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./components/Spinner";

export default function Home() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    router.push("/ceramics");
  }, [router]);
  if (isLoading) return <Spinner />;
  return null;
}

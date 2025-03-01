import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import { Loader } from "../Loader";

const withAuth = (WrappedComponent: any, allowedRoles: string[] = []) => {
  const Wrapper = (props: any) => {
    const { token, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user && !token) {
        router.push("/login");
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push("/not-found");
      }
    }, [user, loading, router]);

    if (loading || !user) return <Loader />;

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;

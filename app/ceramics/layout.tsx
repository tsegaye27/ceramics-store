"use client";
import Link from "next/link";
import { useLanguage } from "@/app/_context/LanguageContext";
import { useAuth } from "../_context/AuthContext";

const CeramicsPage = ({ children }: { children: React.ReactNode }) => {
  const { t, switchLanguage } = useLanguage();
  const { isTokenValid } = useAuth();

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => switchLanguage("en")} className="mr-2">
            English
          </button>
          <button onClick={() => switchLanguage("am")} className="mr-2">
            አማርኛ
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {isTokenValid() ? (
            <div className="flex flex-col items-center space-x-2">
              <Link href="/login" className="text-red-600 hover:text-red-800">
                {t("logout")}
              </Link>
            </div>
          ) : (
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              {t("login")}
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default CeramicsPage;

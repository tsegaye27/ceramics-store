"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface ICeramic {
  _id: string;
  size: string;
  type: string;
  manufacturer: string;
  code: string;
  piecesPerPacket: number;
  totalPackets: number;
  totalPiecesWithoutPacket: number;
  totalArea?: number;
}

const CeramicsPage = () => {
  const [ceramics, setCeramics] = useState<ICeramic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { t, switchLanguage } = useLanguage();
  const { token, logout } = useAuth();
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.user.name);
        if (response.data) {
          setUserName(response.data.user.name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();

    const fetchCeramics = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/ceramics`, {
          params: {
            search: searchQuery,
          },
        });
        setCeramics(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch ceramics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCeramics();
  }, [searchQuery, token]);

  const handleLogout = async () => {
    logout();
    router.push("/auth/login");
  };

  const calculateArea = (
    totalPackets: number,
    totalPiecesWithoutPacket: number,
    piecesPerPacket: number,
    size: string
  ) => {
    if (size === "60x60") {
      const area =
        totalPackets * piecesPerPacket * 0.36 + totalPiecesWithoutPacket * 0.36;
      return area.toFixed(2);
    }
    if (size === "30x60") {
      const area =
        totalPackets * piecesPerPacket * 0.18 + totalPiecesWithoutPacket * 0.18;
      return area.toFixed(2);
    }
    if (size === "30x30") {
      const area =
        totalPackets * piecesPerPacket * 0.09 + totalPiecesWithoutPacket * 0.09;
      return area.toFixed(2);
    }
    if (size === "40x40") {
      const area =
        totalPackets * piecesPerPacket * 0.16 + totalPiecesWithoutPacket * 0.16;
      return area.toFixed(2);
    }
    return "0.00";
  };

  if (!isMounted) {
    return null;
  }

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
          {token ? (
            <div className="flex flex-col items-center space-x-2">
              <span className="text-blue-700 font-semibold">{userName}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        {t("ceramicsList")}
      </h1>

      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-blue-300 p-3 w-full mb-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-4xl flex justify-between">
          <Link
            href="/ceramics/add"
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
          >
            {t("addNewCeramic")}
          </Link>
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
          >
            {t("orderList")}
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">{t("loading")}</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ceramics.map((ceramic: ICeramic) => (
              <div
                key={ceramic._id}
                className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="font-bold text-xl text-blue-800 mb-2">
                  {t("code")}: {ceramic.code}
                </h2>
                <p>
                  {t("size")}: {ceramic.size}
                </p>
                <p>
                  {t("type")}: {ceramic.type}
                </p>
                <p className="mb-4">
                  {t("totalArea")}:{" "}
                  {calculateArea(
                    ceramic.totalPackets,
                    ceramic.totalPiecesWithoutPacket,
                    ceramic.piecesPerPacket,
                    ceramic.size
                  )}{" "}
                  m²
                </p>
                <Link
                  href={`/ceramics/${ceramic._id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {t("viewDetails")}
                </Link>
                <div className="flex space-x-4 mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
                    <Link href={`/ceramics/add/${ceramic._id}`}>
                      {t("add")}
                    </Link>
                  </button>
                  <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200">
                    <Link href={`/ceramics/sell/${ceramic._id}`}>
                      {t("sell")}
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CeramicsPage;

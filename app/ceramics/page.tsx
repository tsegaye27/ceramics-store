"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

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
  const { t, switchLanguage } = useLanguage();

  useEffect(() => {
    const fetchCeramics = async () => {
      try {
        const response = await axios.get(`/api/ceramics`, {
          params: {
            search: searchQuery,
          },
        });
        setCeramics(response.data);
      } catch (error) {
        console.error("Error fetching ceramics:", error);
      }
    };
    fetchCeramics();
  }, [searchQuery]);

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

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <button onClick={() => switchLanguage("en")} className="mr-2">
        English
      </button>
      <button onClick={() => switchLanguage("am")} className="mr-2">
        አማርኛ
      </button>

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
        <Link
          href="/ceramics/add"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          {t("addCeramic")}
        </Link>
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

              <p className=" mb-4">
                {t("totalArea")}:{" "}
                {calculateArea(
                  ceramic.totalPackets,
                  ceramic.totalPiecesWithoutPacket,
                  ceramic.piecesPerPacket,
                  ceramic.size
                )}{" "}
                m²
              </p>
              <Link href={`/ceramics/${ceramic._id}`} className="text-blue-500">
                {t("viewDetails")}
              </Link>
              <div className="flex space-x-4 mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
                  <Link href={`/ceramics/add/${ceramic._id}`}>{t("add")}</Link>
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
      </div>
    </div>
  );
};

export default CeramicsPage;

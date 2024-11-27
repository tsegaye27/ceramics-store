"use client";
import { useLanguage } from "@/app/_context/LanguageContext";
import axiosInstance from "@/app/_lib/axios";
import { ICeramic } from "@/app/_types/types";
import { calculateArea } from "@/app/_utils/helperFunctions";
import logger from "@/app/_utils/logger";
import Link from "next/link";
import { useEffect, useState } from "react";

const CeramicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  const [ceramics, setCeramics] = useState<ICeramic[]>([]);
  useEffect(() => {
    const fetchCeramics = async () => {
      try {
        if (searchQuery) {
          const res = await axiosInstance.get(
            `/ceramics/search?search=${searchQuery}`
          );
          setCeramics(res.data);
          logger.info("Ceramics fetched successfully", res.data);
          return;
        }
        const res = await axiosInstance.get("/ceramics/getAll");
        setCeramics(res.data);
        logger.info("Ceramics fetched successfully", res.data);
      } catch (err: any) {
        logger.error(err);
      }
    };
    fetchCeramics();
  }, [searchQuery]);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        {t("ceramicsList")}
      </h1>

      <div className="max-w-4xl mx-auto">
        <form className="flex mb-6">
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchCeramics")}
            className="border border-blue-300 p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ceramics &&
            ceramics.map((ceramic) => (
              <div
                key={ceramic._id}
                className={`bg-white p-5 rounded-lg ${
                  ceramic.totalPackets <= 10
                    ? "border-2 border-red-600 shadow-lg"
                    : "shadow-lg"
                } hover:transition-shadow duration-300`}
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
                  {ceramic.size === "zekolo" ? "m" : "m²"}
                </p>
                <Link
                  href={`/ceramics/${ceramic._id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {t("viewDetails")}
                </Link>
                <div className="flex space-x-4 mt-4">
                  <Link
                    href={`/ceramics/add/${ceramic._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-200"
                  >
                    {t("add")}
                  </Link>
                  <Link
                    href={`/ceramics/sell/${ceramic._id}`}
                    className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                  >
                    {t("sell")}
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CeramicsPage;

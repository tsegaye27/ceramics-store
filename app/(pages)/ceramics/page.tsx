"use client";
import { useLanguage } from "@/app/_context/LanguageContext";
import axiosInstance from "@/app/_lib/axios";
import { ICeramic } from "@/app/_types/types";
import { calculateArea } from "@/app/_utils/helperFunctions";
import logger from "@/app/_utils/logger";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const CeramicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const { t } = useLanguage();
  const [ceramics, setCeramics] = useState<ICeramic[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCeramics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = debouncedSearchQuery
          ? await axiosInstance.get("/ceramics/search", {
              params: { search: debouncedSearchQuery },
            })
          : await axiosInstance.get("/ceramics/getAll");
        setCeramics(res.data.data || []);
        logger.info("Ceramics fetched successfully", res.data);
      } catch (err) {
        logger.error("Failed to fetch ceramics:", err);
        setError("Failed to load ceramics. Please try again.");
        setCeramics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCeramics();
  }, [debouncedSearchQuery]);

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
            placeholder={t("searchPlaceholder")}
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

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : ceramics && ceramics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ceramics.map((ceramic) => (
              <div
                key={ceramic?._id}
                className={`bg-white p-5 rounded-lg shadow-lg ${
                  ceramic?.totalPackets <= 10 ? "border-2 border-red-600" : ""
                } hover:transition-shadow duration-300`}
              >
                <h2 className="font-bold text-xl text-blue-800 mb-2">
                  {t("code")}: {ceramic?.code || "N/A"}
                </h2>
                <p>
                  {t("size")}: {ceramic?.size || "N/A"}
                </p>
                <p>
                  {t("type")}: {ceramic?.type || "N/A"}
                </p>
                <p className="mb-4">
                  {t("totalArea")}:{" "}
                  {calculateArea(
                    ceramic?.totalPackets || 0,
                    ceramic?.totalPiecesWithoutPacket || 0,
                    ceramic?.piecesPerPacket || 0,
                    ceramic?.size || ""
                  )}{" "}
                  {ceramic?.size === "zekolo" ? "m" : "m²"}
                </p>
                <Link
                  href={`/ceramics/${ceramic?._id}`}
                  aria-label={`${t("viewDetails")} ${ceramic?.code}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {t("viewDetails")}
                </Link>
                <div className="flex space-x-4 mt-4">
                  <Link
                    href={`/ceramics/add/${ceramic?._id}`}
                    aria-label={`${t("add")} ${ceramic?.code}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-200"
                  >
                    {t("add")}
                  </Link>
                  <Link
                    href={`/ceramics/sell/${ceramic?._id}`}
                    aria-label={`${t("sell")} ${ceramic?.code}`}
                    className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                  >
                    {t("sell")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="col-span-3 text-center text-gray-500 mt-8">
            {t("noCeramicsFound")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CeramicsPage;

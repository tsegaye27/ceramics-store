"use client";
import { useAppDispatch, useAppSelector } from "@/app/_features/store/store";
import { useLanguage } from "@/app/_context/LanguageContext";
import { calculateArea } from "@/app/_utils/helperFunctions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import { fetchCeramics, searchCeramics } from "@/app/_features/ceramics/slice";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const CeramicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { ceramics, loading, error } = useAppSelector(
    (state) => state.ceramics,
  );
  const { token, user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddNewCeramic = () => {
    startTransition(() => {
      router.push("/ceramics/add");
    });
  };

  const handleViewOrders = () => {
    startTransition(() => {
      router.push("/orders");
    });
  };

  const handleAddCeramic = (ceramicId: string) => {
    startTransition(() => {
      router.push(`/ceramics/add/${ceramicId}`);
    });
  };

  const handleSellCeramic = (ceramicId: string) => {
    startTransition(() => {
      router.push(`/ceramics/sell/${ceramicId}`);
    });
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
  }, [token]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(searchCeramics(debouncedSearchQuery));
    } else {
      dispatch(fetchCeramics());
    }
  }, [debouncedSearchQuery, dispatch]);

  const isAdmin = user?.role === "admin";

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

        {isAdmin && (
          <div className="w-4xl flex justify-between">
            <button
              onClick={handleAddNewCeramic}
              disabled={isPending}
              className={`bg-transparent mb-6 text-blue-500 rounded-md ${
                isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-blue-600"
              }`}
            >
              {t("addNewCeramic")}
            </button>

            <button
              onClick={handleViewOrders}
              disabled={isPending}
              className={`bg-transparent mb-6 text-blue-500 rounded-md ${
                isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-blue-600"
              }`}
            >
              {t("orderList")}
            </button>
          </div>
        )}

        {loading || isPending ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : ceramics.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500 mt-8">
            {t("noCeramicsFound")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ceramics.map((ceramic) => (
              <div
                key={ceramic._id}
                className={`bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  ceramic.totalPackets <= 10 ? "border-2 border-red-600" : ""
                }`}
              >
                {ceramic.imageUrl && (
                  <div className="relative -m-5 mb-4 rounded-t-lg overflow-hidden">
                    <Image
                      src={ceramic.imageUrl || ""}
                      alt={ceramic?.code || "Ceramic Image"}
                      width={500}
                      height={300}
                      priority
                      className="rounded-t-lg h-48 w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="text-white font-semibold text-lg">
                        {ceramic.code || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                <h2 className="font-bold text-xl text-blue-800 mb-2">
                  {t("code")}: {ceramic.code || "N/A"}
                </h2>
                <p>
                  {t("size")}: {ceramic.size || "N/A"}
                </p>
                <p>
                  {t("type")}: {ceramic.type || "N/A"}
                </p>
                <p className="mb-4">
                  {t("totalArea")}:{" "}
                  {calculateArea(
                    ceramic.totalPackets || 0,
                    ceramic.totalPiecesWithoutPacket || 0,
                    ceramic.piecesPerPacket || 0,
                    ceramic.size || "",
                  )}{" "}
                  {ceramic.size === "zekolo" ? "m" : "m²"}
                </p>
                <Link
                  href={`/ceramics/${ceramic._id}`}
                  aria-label={`${t("viewDetails")} ${ceramic.code}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {t("viewDetails")}
                </Link>

                {isAdmin && (
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleAddCeramic(ceramic._id as string)}
                      aria-label={`${t("add")} ${ceramic.code}`}
                      disabled={isPending}
                      className={`bg-white py-2 px-4 mb-6 text-blue-500 rounded-md ${
                        isPending
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-white hover:bg-blue-500"
                      }`}
                    >
                      {t("add")}
                    </button>
                    <button
                      onClick={() => handleSellCeramic(ceramic._id as string)}
                      aria-label={`${t("sell")} ${ceramic.code}`}
                      disabled={isPending}
                      className={`text-white py-2 px-4 mb-6 bg-blue-500 rounded-md ${
                        isPending
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-400"
                      }`}
                    >
                      {t("sell")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CeramicsPage;

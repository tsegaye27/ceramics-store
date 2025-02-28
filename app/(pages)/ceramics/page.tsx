"use client";
import { useAppDispatch, useAppSelector } from "@/app/_features/store/store";
import { useLanguage } from "@/app/_context/LanguageContext";
import { calculateArea } from "@/app/_utils/helperFunctions";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import { fetchCeramics, searchCeramics } from "@/app/_features/ceramics/slice";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import SkeletonLoader from "@/app/_components/SkeletonLoader";
import withAuth from "@/app/_components/hoc/withAuth";
import { Loader } from "@/app/_components/Loader";

const CeramicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { ceramics, loading } = useAppSelector((state) => state.ceramics);
  const { token, user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(false);

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

  const handleViewDetails = (ceramicId: string) => {
    startTransition(() => {
      router.push(`/ceramics/${ceramicId}`);
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
    setIsChecked(true);

    if (debouncedSearchQuery) {
      dispatch(searchCeramics(debouncedSearchQuery));
    } else {
      dispatch(fetchCeramics());
    }
  }, [debouncedSearchQuery, dispatch, token, router]);
  const isAdmin = user?.role === "admin";

  if (!isChecked) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-blue-50 dark:bg-gray-900 min-h-screen">
      {isPending ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-16 w-16 border-8 border-t-8 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-300 mb-8">
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
                className="border border-blue-300 dark:border-gray-600 p-3 w-full rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </form>

            {isAdmin && (
              <div className="max-w-4xl flex justify-between mb-6">
                <button
                  onClick={handleAddNewCeramic}
                  disabled={isPending}
                  className={`text-blue-500 dark:text-blue-400 rounded-md transition ${
                    isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-blue-600 dark:hover:text-blue-300"
                  }`}
                >
                  {t("addNewCeramic")}
                </button>

                <button
                  onClick={handleViewOrders}
                  disabled={isPending}
                  className={`text-blue-500 dark:text-blue-400 rounded-md transition ${
                    isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-blue-600 dark:hover:text-blue-300"
                  }`}
                >
                  {t("orderList")}
                </button>
              </div>
            )}

            {loading ? (
              <SkeletonLoader />
            ) : ceramics.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                {t("noCeramicsFound")}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {ceramics.map((ceramic) => (
                  <div
                    key={ceramic._id}
                    className={`bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                      ceramic.totalPackets <= 10
                        ? "border-2 border-red-600 dark:border-red-500"
                        : ""
                    }`}
                  >
                    {ceramic.imageUrl && (
                      <div className="relative mb-4 rounded-t-lg overflow-hidden">
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
                            {ceramic.size}
                          </span>
                        </div>
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex flex-col space-y-2">
                            <button
                              onClick={() =>
                                handleAddCeramic(ceramic._id as string)
                              }
                              title={`${t("add")} ${ceramic.code}`}
                              disabled={isPending}
                              className={`bg-white/90 dark:bg-gray-700 text-blue-600 dark:text-blue-300 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition ${
                                isPending
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:scale-105 hover:bg-white dark:hover:bg-gray-600"
                              }`}
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                handleSellCeramic(ceramic._id as string)
                              }
                              title={`${t("sell")} ${ceramic.code}`}
                              disabled={isPending}
                              className={`bg-white/90 dark:bg-gray-700 text-red-600 dark:text-red-400 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition ${
                                isPending
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:scale-105 hover:bg-white dark:hover:bg-gray-600"
                              }`}
                            >
                              -
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <h2 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-2">
                      {t("code")}: {ceramic.code}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("size")}: {ceramic.size}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("type")}: {ceramic.type}
                    </p>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      {t("totalArea")}:{" "}
                      {calculateArea(
                        ceramic.totalPackets || 0,
                        ceramic.totalPiecesWithoutPacket || 0,
                        ceramic.piecesPerPacket || 0,
                        ceramic.size || "",
                      )}{" "}
                      {ceramic.size === "zekolo" ? "m" : "m²"}
                    </p>
                    <button
                      onClick={() => handleViewDetails(ceramic._id as string)}
                      aria-label={`${t("viewDetails")} ${ceramic.code}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline dark:hover:text-blue-300"
                    >
                      {t("viewDetails")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default withAuth(CeramicsPage, ["user", "admin"]);

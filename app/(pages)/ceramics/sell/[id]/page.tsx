"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { soldCeramicSchema } from "@/app/_validators/ceramicSchema";
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellCeramic } from "@/app/_features/ceramics/slice";
import toast from "react-hot-toast";
import withAuth from "@/app/_components/hoc/withAuth";
import { useAuth } from "@/app/_context/AuthContext";
import { Loader } from "@/app/_components/Loader";

type SellCeramicProps = {
  params: {
    id: string;
  };
};

type FormData = z.infer<typeof soldCeramicSchema>;

const SellCeramic = ({ params }: SellCeramicProps) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { loading } = useAppSelector((state: RootState) => state.ceramics);
  const [isChecked, setIsChecked] = useState(false);
  const { token, user, loading: contextLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(soldCeramicSchema),
  });

  const handleBack = () => {
    startTransition(() => {
      router.push("/ceramics");
    });
  };

  useEffect(() => {
    if (!token && !contextLoading) {
      router.replace("/login");
      return;
    } else if (user.role !== "admin") {
      router.replace("/not-found");
      return;
    }
    setIsChecked(true);
  }, [token, user, router, contextLoading]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const packets = isNaN(data.packetsSold) ? 0 : data.packetsSold;
    const pieces = isNaN(data.piecesSold) ? 0 : data.piecesSold;
    const pricePerArea = isNaN(data.pricePerArea) ? 0 : data.pricePerArea;

    try {
      const result = await dispatch(
        sellCeramic({
          ceramicId: params.id,
          packetsSold: packets,
          piecesSold: pieces,
          pricePerArea,
          seller: data.seller,
        }),
      ).unwrap();
      if (result?.message) {
        toast.success("Ceramic sold successfully!");
      } else {
        toast.error("Failed to sell ceramic");
      }
      reset();
    } catch (err: any) {
      toast.error(err || "Failed to sell ceramic");
    }
  };

  if (!isChecked && contextLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-transparent min-h-screen flex items-center justify-center">
      {isPending ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-lg w-full dark:bg-gray-800 bg-white p-8 rounded-xl shadow-md dark:shadow-gray-700">
            <button
              onClick={handleBack}
              className="text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:text-blue-700 mb-6 inline-block font-medium"
            >
              {t("back")}
            </button>
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
              {t("sellCeramic")}
            </h1>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("packetsToSell")}:
                  </label>
                  <input
                    type="number"
                    {...register("packetsSold", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterPackets")}
                  />
                  {errors.packetsSold && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.packetsSold.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("piecesToSell")}:
                  </label>
                  <input
                    type="number"
                    {...register("piecesSold", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterPieces")}
                  />
                  {errors.piecesSold && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.piecesSold.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("pricePerArea")}:
                  </label>
                  <input
                    type="number"
                    {...register("pricePerArea", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterPrice")}
                  />
                  {errors.pricePerArea && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pricePerArea.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seller")}:
                  </label>
                  <input
                    type="text"
                    {...register("seller")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterSellerName")}
                  />
                  {errors.seller && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.seller.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full text-white py-3 rounded-lg mt-4 ${loading ? "bg-blue-300 hover:bg-blue-100" : "bg-blue-600 hover:bg-blue-700"} transition duration-300`}
                >
                  {loading ? t("selling...") : t("sell")}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withAuth(SellCeramic, ["admin"]);

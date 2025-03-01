"use client";

import { useEffect, useState, useTransition } from "react";
import { useLanguage } from "@/app/_context/LanguageContext";
import toast from "react-hot-toast";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCeramicSchema } from "@/app/_validators/ceramicSchema";
import { updateCeramic } from "@/app/_features/ceramics/slice";
import withAuth from "@/app/_components/hoc/withAuth";
import { useAuth } from "@/app/_context/AuthContext";
import { Loader } from "@/app/_components/Loader";

type AddCeramicProps = {
  params: {
    id: string;
  };
};

type FormData = z.infer<typeof updateCeramicSchema>;

const AddCeramic = ({ params }: AddCeramicProps) => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { loading } = useAppSelector((state: RootState) => state.ceramics);
  const [isChecked, setIsChecked] = useState(false);
  const { token, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updateCeramicSchema),
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/not-found");
    }
    setIsChecked(true);
  }, [token, user, router]);

  const handleBack = () => {
    startTransition(() => {
      router.push("/ceramics");
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const packets = isNaN(data.packetsAdded) ? 0 : data.packetsAdded;
    const pieces = isNaN(data.piecesAdded) ? 0 : data.piecesAdded;

    try {
      const result = await dispatch(
        updateCeramic({
          ceramicId: params.id,
          packetsAdded: packets,
          piecesAdded: pieces,
        }),
      ).unwrap();

      if (result?.message) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isChecked) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-transparent min-h-screen flex items-center justify-center">
      {isPending ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md dark:shadow-gray-700">
            <button
              onClick={handleBack}
              className="text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:text-blue-700 mb-6 inline-block font-medium"
            >
              {t("back")}
            </button>

            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
              {t("addCeramic")}
            </h1>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("packetsToAdd")}
                  </label>
                  <input
                    type="number"
                    {...register("packetsAdded", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterPackets")}
                  />
                  {errors.packetsAdded && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.packetsAdded.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("piecesToAdd")}
                  </label>
                  <input
                    type="number"
                    {...register("piecesAdded", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterPieces")}
                  />
                  {errors.piecesAdded && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.piecesAdded.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300  ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {loading ? t("updating") : t("add")}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withAuth(AddCeramic, ["admin"]);

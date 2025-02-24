"use client";

import { useTransition } from "react";
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

type AddCeramicProps = {
  params: {
    id: string;
  };
};

type FormData = z.infer<typeof updateCeramicSchema>;

export default function AddCeramic({ params }: AddCeramicProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { loading } = useAppSelector((state: RootState) => state.ceramics);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updateCeramicSchema),
  });

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
      console.log("Result:", result);

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
  return (
    <div className="container mx-auto p-6 bg-transparent min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-md">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-700 mb-6 inline-block font-medium"
        >
          {t("back")}
        </button>
        {isPending ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              {t("addCeramic")}
            </h1>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("packetsToAdd")}
                  </label>
                  <input
                    type="number"
                    {...register("packetsAdded", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterPackets")}
                  />
                  {errors.packetsAdded && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.packetsAdded.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("piecesToAdd")}
                  </label>
                  <input
                    type="number"
                    {...register("piecesAdded", { valueAsNumber: true })}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 bg-blue-600 hover:bg-blue-700`}
                >
                  {loading ? t("updating") : t("add")}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

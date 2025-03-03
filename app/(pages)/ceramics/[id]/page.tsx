"use client";
import { formatDate } from "@/app/_utils/helperFunctions";
import { useEffect, useState, useTransition } from "react";
import { ICeramic } from "@/app/_types/types";
import { useLanguage } from "@/app/_context/LanguageContext";
import Image from "next/image";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import toast from "react-hot-toast";
import { ceramicDetails } from "@/app/_features/ceramics/slice";
import { useRouter } from "next/navigation";
import { Loader } from "@/app/_components/Loader";
import withAuth from "@/app/_components/hoc/withAuth";
import { useAuth } from "@/app/_context/AuthContext";

function CeramicDetail({ params }: { params: { id: string } }) {
  const languageContext = useLanguage();
  const t = languageContext?.t;
  const [ceramic, setCeramic] = useState<ICeramic | null>(null);
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { loading } = useAppSelector((state: RootState) => state.ceramics);
  const { user, token, loading: contextLoading } = useAuth();
  const [isChecked, setIsChecked] = useState(false);

  const handleBack = () => {
    startTransition(() => {
      router.push("/ceramics");
    });
  };
  useEffect(() => {
    if (!token && !contextLoading) {
      router.push("/login");
      return;
    }
    setIsChecked(true);

    const fetchDetails = async () => {
      try {
        const response = await dispatch(ceramicDetails(params.id));
        setCeramic(response.payload.data);
      } catch (err: any) {
        toast.error("Failed to fetch ceramic details", err);
      }
    };
    fetchDetails();
  }, [params.id, token, user, dispatch, router, contextLoading]);

  if (!isChecked || contextLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6 bg-blue-50 dark:bg-gray-900 min-h-screen">
      {!ceramic || loading || isPending ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg dark:shadow-gray-700/50">
            <button
              onClick={handleBack}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 md:mb-6 inline-block text-sm md:text-base"
            >
              {t("back")}
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center text-blue-700 dark:text-blue-400">
              {t("ceramicDetails")}
            </h1>

            {ceramic.imageUrl && (
              <div className="mb-4 md:mb-6 text-center">
                <Image
                  src={ceramic.imageUrl}
                  alt={ceramic.code || t("ceramicImage")}
                  width={400}
                  height={400}
                  priority
                  className="rounded-lg w-full max-w-[400px] h-auto object-cover mx-auto shadow-md dark:border dark:border-gray-600"
                />
              </div>
            )}

            <div className="space-y-3 md:space-y-4 text-blue-800 dark:text-gray-300">
              {[
                {
                  label: t("date"),
                  value:
                    ceramic?.createdAt &&
                    formatDate(ceramic?.createdAt?.toString()),
                },
                { label: t("size"), value: ceramic?.size },
                { label: t("type"), value: ceramic?.type },
                { label: t("manufacturer"), value: ceramic?.manufacturer },
                { label: t("code"), value: ceramic?.code },
                {
                  label: t("piecesPerPacket"),
                  value: ceramic?.piecesPerPacket,
                },
                { label: t("totalPackets"), value: ceramic?.totalPackets },
                {
                  label: t("totalPiecesWithoutPacket"),
                  value: ceramic?.totalPiecesWithoutPacket,
                },
                {
                  label: t("updatedAt"),
                  value:
                    ceramic?.updatedAt &&
                    formatDate(ceramic?.updatedAt?.toString()),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 md:p-4 bg-blue-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <strong className="block font-semibold text-blue-900 dark:text-blue-300 text-sm md:text-base mb-1">
                    {item.label}:
                  </strong>
                  <span className="break-words text-sm md:text-base">
                    {item.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CeramicDetail;

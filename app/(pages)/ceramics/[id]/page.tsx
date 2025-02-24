"use client";
import { formatDate } from "@/app/_utils/helperFunctions";
import { useEffect, useState, useTransition } from "react";
import { ICeramic } from "@/app/_types/types";
import { useLanguage } from "@/app/_context/LanguageContext";
import Image from "next/image";
import { useAppDispatch } from "@/app/_features/store/store";
import toast from "react-hot-toast";
import { ceramicDetails } from "@/app/_features/ceramics/slice";
import { useRouter } from "next/navigation";

export default function CeramicDetail({ params }: { params: { id: string } }) {
  const languageContext = useLanguage();
  const t = languageContext?.t;
  const [ceramic, setCeramic] = useState<ICeramic | null>(null);
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBack = () => {
    startTransition(() => {
      router.push("/ceramics");
    });
  };
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await dispatch(ceramicDetails(params.id));
        setCeramic(response.payload.data);
      } catch (err: any) {
        toast.error("Failed to fetch ceramic details", err);
      }
    };
    fetchDetails();
  }, [params.id]);

  if (!ceramic || isPending)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
        >
          {t("back")}
        </button>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          {t("ceramicDetails")}
        </h1>

        {ceramic.imageUrl && (
          <div className="mb-6 text-center">
            <Image
              src={ceramic.imageUrl}
              alt={ceramic.code || t("ceramicImage")}
              width={400}
              height={400}
              priority
              className="rounded-lg w-auto h-auto object-cover mx-auto shadow-md"
            />
          </div>
        )}

        <div className="space-y-4 text-blue-800">
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("date")}:
            </strong>
            <span>
              {ceramic?.createdAt && formatDate(ceramic?.createdAt.toString())}
            </span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("size")}:
            </strong>
            <span>{ceramic?.size}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("type")}:
            </strong>
            <span>{ceramic?.type}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("manufacturer")}:
            </strong>
            <span>{ceramic?.manufacturer}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("code")}:
            </strong>
            <span>{ceramic?.code}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("piecesPerPacket")}:
            </strong>
            <span>{ceramic?.piecesPerPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("totalPackets")}:
            </strong>
            <span>{ceramic?.totalPackets}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("totalPiecesWithoutPacket")}:
            </strong>
            <span>{ceramic?.totalPiecesWithoutPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("updatedAt")}:
            </strong>
            <span>
              {ceramic?.updatedAt && formatDate(ceramic?.updatedAt.toString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

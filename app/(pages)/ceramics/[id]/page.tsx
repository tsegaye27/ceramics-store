"use client";
import Link from "next/link";
import { formatDate } from "@/app/_utils/helperFunctions";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/_lib/axios";
import { ICeramic } from "@/app/_types/types";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function CeramicDetail({ params }: { params: { id: string } }) {
  const languageContext = useLanguage();
  const t = languageContext?.t;
  const [ceramic, setCeramic] = useState<ICeramic | null>(null);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `/ceramics/getById?ceramicId=${params.id}`
        );
        setCeramic(res.data.data);
      } catch (err: any) {}
    };
    fetchDetails();
  }, [params.id]);
  if (!ceramic)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="h-20 w-20 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href="/ceramics"
          className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
        >
          {t("back")}
        </Link>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          {t("ceramicDetails")}
        </h1>
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

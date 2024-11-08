"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/_context/LanguageContext";
import Spinner from "@/app/_components/Spinner";
import { ICeramics } from "@/app/_models/Ceramics";

export default function CeramicDetail() {
  const [ceramic, setCeramic] = useState<ICeramics | null>(null);
  const { id } = useParams();
  const { t, switchLanguage } = useLanguage();

  useEffect(() => {
    const fetchCeramicById = async () => {
      try {
        const res = await axios.get(`/api/ceramics`, {
          params: {
            id,
          },
        });
        setCeramic(res.data);
      } catch (error) {
        console.error("Error fetching ceramic by ID:", error);
      }
    };
    fetchCeramicById();
  }, [id]);

  const handleNavigate = () => {
    setCeramic(null);
  };

  if (!ceramic) {
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );
  }

  const formatDate = (unformattedDate: string) => {
    const date = new Date(unformattedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const hours = new Date(unformattedDate).getHours();
    const min = new Date(unformattedDate).getMinutes();
    const time = hours >= 12 ? "pm" : "am";
    return date + " at " + hours + ":" + min + " " + time.toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <button onClick={() => switchLanguage("en")} className="mr-2">
        English
      </button>
      <button onClick={() => switchLanguage("am")} className="mr-2">
        አማርኛ
      </button>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href="/ceramics"
          onClick={handleNavigate}
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
            <span>{formatDate(ceramic.createdAt.toString())}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("size")}:
            </strong>
            <span>{ceramic.size}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("type")}:
            </strong>
            <span>{ceramic.type}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("manufacturer")}:
            </strong>
            <span>{ceramic.manufacturer}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("code")}:
            </strong>
            <span>{ceramic.code}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("piecesPerPacket")}:
            </strong>
            <span>{ceramic.piecesPerPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("totalPackets")}:
            </strong>
            <span>{ceramic.totalPackets}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("totalPiecesWithoutPacket")}:
            </strong>
            <span>{ceramic.totalPiecesWithoutPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              {t("updatedAt")}:
            </strong>
            <span>{formatDate(ceramic.updatedAt.toString())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

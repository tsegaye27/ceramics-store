"use client";

import { useLanguage } from "@/app/_context/LanguageContext";
import logger from "@/app/_utils/logger";
import Link from "next/link";
import { useState } from "react";

const CeramicForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    size: "",
    type: "",
    manufacturer: "",
    code: "",
    piecesPerPacket: 0,
    totalPackets: 0,
    totalPiecesWithoutPacket: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.info(`${formData}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <Link href="/ceramics" className="text-blue-500">
        {t("back")}
      </Link>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {t("addCeramic")}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="size"
          onChange={handleChange}
          placeholder={t("size")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="type"
          placeholder={t("type")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="manufacturer"
          placeholder={t("manufacturer")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="code"
          placeholder={t("code")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="piecesPerPacket"
          placeholder={t("piecesPerPacket")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="totalPackets"
          placeholder={t("totalPackets")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="totalPiecesWithoutPacket"
          placeholder={t("totalPiecesWithoutPacket")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200`}
        >
          {t("addNewCeramic")}
        </button>
      </form>
    </div>
  );
};

export default CeramicForm;

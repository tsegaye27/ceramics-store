"use client";

import { useLanguage } from "@/app/_context/LanguageContext";
import axiosInstance from "@/app/_lib/axios";
import logger from "@/app/_utils/logger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CeramicForm = () => {
  const languageContext = useLanguage();
  const t = languageContext?.t;
  const [formData, setFormData] = useState({
    size: "",
    type: "",
    manufacturer: "",
    code: "",
    piecesPerPacket: "",
    totalPackets: "",
    totalPiecesWithoutPacket: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      const res = await axiosInstance.post("/ceramics/addNew", {
        ...formData,
        piecesPerPacket: Number(formData.piecesPerPacket),
        totalPackets: Number(formData.totalPackets),
        totalPiecesWithoutPacket: Number(formData.totalPiecesWithoutPacket),
      });
      logger.info(`${res}`);
      setSuccess("Ceramic added successfully");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      setFormData({
        size: "",
        type: "",
        manufacturer: "",
        code: "",
        piecesPerPacket: "",
        totalPackets: "",
        totalPiecesWithoutPacket: "",
      });
      router.push("/ceramics");
    } catch (err: any) {
      logger.error("Error while adding ceramic:", err);
      setError(err.response.data.error || "Internal server error");
    } finally {
      setLoading(false);
      if (error) {
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <input
          type="text"
          name="size"
          onChange={handleChange}
          value={formData.size}
          disabled={loading}
          placeholder={t("size")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="type"
          onChange={handleChange}
          value={formData.type}
          disabled={loading}
          placeholder={t("type")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="manufacturer"
          onChange={handleChange}
          value={formData.manufacturer}
          disabled={loading}
          placeholder={t("manufacturer")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="code"
          onChange={handleChange}
          value={formData.code}
          disabled={loading}
          placeholder={t("code")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="piecesPerPacket"
          onChange={handleChange}
          value={formData.piecesPerPacket}
          disabled={loading}
          placeholder={t("piecesPerPacket")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="totalPackets"
          onChange={handleChange}
          value={formData.totalPackets}
          disabled={loading}
          placeholder={t("totalPackets")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="totalPiecesWithoutPacket"
          onChange={handleChange}
          value={formData.totalPiecesWithoutPacket}
          disabled={loading}
          placeholder={t("totalPiecesWithoutPacket")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out`}
        >
          {loading ? "Adding Ceramic..." : `${t("addNewCeramic")}`}
        </button>
      </form>
    </div>
  );
};

export default CeramicForm;

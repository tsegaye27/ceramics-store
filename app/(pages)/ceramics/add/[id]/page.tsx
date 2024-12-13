"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/app/_lib/axios";
import { useLanguage } from "@/app/_context/LanguageContext";

type AddCeramicProps = {
  params: {
    id: string;
  };
};

export default function AddCeramic({ params }: AddCeramicProps) {
  const [packetsToAdd, setPacketsToAdd] = useState("");
  const [piecesToAdd, setPiecesToAdd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { t } = useLanguage();
  async function addCeramic(
    ceramicId: string,
    packetsAdded: number,
    piecesAdded: number
  ) {
    try {
      const response = await axiosInstance.patch(`/ceramics/addById`, {
        ceramicId,
        packetsAdded,
        piecesAdded,
      });
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const packetsAdded = parseInt(packetsToAdd);
    const piecesAdded = parseInt(piecesToAdd);

    if (isNaN(packetsAdded) || isNaN(piecesAdded)) {
      setErrorMessage("Both fields must be valid numbers.");
      return;
    }

    try {
      await addCeramic(params.id, packetsAdded, piecesAdded);
      setSuccessMessage("Ceramic updated successfully!");
      setPacketsToAdd("");
      setPiecesToAdd("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-md">
        <Link
          href="/ceramics"
          className="text-blue-500 hover:text-blue-700 mb-6 inline-block font-medium"
        >
          {t("back")}
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {t("addCeramic")}
        </h1>
        <div className="space-y-4">
          {errorMessage && (
            <div className="text-red-500 bg-red-100 border border-red-200 rounded-lg p-3 text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 bg-green-100 border border-green-200 rounded-lg p-3 text-center">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleAdd} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("packetsToAdd")}
              </label>
              <input
                type="text"
                name="packetsToAdd"
                value={packetsToAdd}
                onChange={(e) => setPacketsToAdd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("enterPackets")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("piecesToAdd")}
              </label>
              <input
                type="text"
                name="piecesToAdd"
                value={piecesToAdd}
                onChange={(e) => setPiecesToAdd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("enterPieces")}
              />
            </div>
            <button
              type="submit"
              disabled={!packetsToAdd || !piecesToAdd}
              className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
                packetsToAdd && piecesToAdd
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {t("add")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

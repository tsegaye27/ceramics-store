"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import Spinner from "@/app/components/Spinner";

export default function AddCeramic() {
  const [packetsToAdd, setPacketsToAdd] = useState<string>("0");
  const [piecesToAdd, setPiecesToAdd] = useState<string>("0");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const [ppp, setPpp] = useState<number>(0);
  const { t, switchLanguage } = useLanguage();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCeramic = async () => {
      try {
        const ceramic = await axios.get(`/api/ceramics`, {
          params: {
            id,
          },
        });
        if (!ceramic) {
          setLoading(true);
          router.push("/ceramics");
          return;
        }
        setPpp(ceramic.data.piecesPerPacket);
      } catch (error) {
        console.error("Error fetching ceramic:", error);
      }
    };
    fetchCeramic();
  }, [id, router]);

  const validateInput = (value: string) => {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= 0 && /^\d+$/.test(value);
  };

  const handleAdd = async () => {
    let packets = Number(packetsToAdd);
    let pieces = Number(piecesToAdd);

    if (!validateInput(packetsToAdd) || !validateInput(piecesToAdd)) {
      setErrorMessage("Please enter numbers only(non-negative number).");
      return;
    }
    while (pieces >= ppp) {
      packets += Math.floor(pieces / ppp);
      pieces = pieces % ppp;
    }

    try {
      await axios.patch(`/api/ceramics/`, {
        id,
        totalPackets: packets,
        totalPiecesWithoutPacket: pieces,
        action: "add",
      });
      setLoading(true);
      router.push(`/ceramics`);
    } catch (error) {
      console.error("Error adding ceramic inventory:", error);
      setErrorMessage("Failed to update inventory.");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <button onClick={() => switchLanguage("en")} className="mr-2">
        English
      </button>
      <button onClick={() => switchLanguage("am")} className="mr-2">
        አማርኛ
      </button>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          className="text-blue-600 hover:text-blue-800  mb-6 inline-block"
        >
          {t("back")}
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">
          {t("addCeramic")}
        </h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              {t("packetsToAdd")}:
            </label>
            <input
              type="text"
              value={packetsToAdd}
              onChange={(e) => setPacketsToAdd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("enterPackets")}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("piecesToAdd")}:
            </label>
            <input
              type="text"
              value={piecesToAdd}
              onChange={(e) => setPiecesToAdd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("enterPieces")}
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
          >
            {t("add")}
          </button>
        </div>
      </div>
    </div>
  );
}

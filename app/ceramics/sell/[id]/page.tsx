"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Spinner from "@/app/components/Spinner";

export default function SellCeramic() {
  const [packetsToSell, setPacketsToSell] = useState<string>("0");
  const [piecesToSell, setPiecesToSell] = useState<string>("0");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const [ppp, setPpp] = useState<number>(0);
  const { t, switchLanguage } = useLanguage();
  const [seller, setSeller] = useState<string>("");
  const { token } = useAuth();
  const [price, setPrice] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCeramic = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchCeramic();
  }, [id, router]);

  const validateInput = (value: string) => {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= 0 && /^\d+$/.test(value);
  };

  const handleSell = async () => {
    let packets = Number(packetsToSell);
    let pieces = Number(piecesToSell);

    if (!validateInput(packetsToSell) || !validateInput(piecesToSell)) {
      setErrorMessage("Please enter valid positive numbers.");
      return;
    } else if (!seller) {
      setErrorMessage("Please enter the seller's name.");
      return;
    }

    while (pieces >= ppp) {
      packets += Math.floor(pieces / ppp);
      pieces = pieces % ppp;
    }

    try {
      setLoading(true);
      await axios.patch(`/api/ceramics/`, {
        id,
        totalPackets: packets,
        totalPiecesWithoutPacket: pieces,
        action: "sell",
      });
      await axios.post(
        `/api/orders`,
        {
          ceramicId: id,
          seller,
          packets,
          pieces,
          price: Number(price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(id, seller, packets, pieces, price);
      setLoading(true);
      router.push(`/ceramics`);
    } catch (error) {
      console.error("Error selling ceramic inventory:", error);
      setErrorMessage("Failed to update inventory.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Spinner />;
  return (
    <div
      className={`container mx-auto p-6 bg-gray-100 min-h-screen ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <button onClick={() => switchLanguage("en")} className="mr-2">
        English
      </button>
      <button onClick={() => switchLanguage("am")} className="mr-2">
        አማርኛ
      </button>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          onClick={() => setLoading(true)}
          className="text-blue-600 hover:text-blue-800  mb-6 inline-block"
        >
          {t("back")}
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">
          {t("sellCeramic")}
        </h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              {t("packetsToSell")}:
            </label>
            <input
              type="text"
              value={packetsToSell}
              onChange={(e) =>
                setPacketsToSell(Number(e.target.value) ? e.target.value : "")
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("enterPackets")}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("piecesToSell")}:
            </label>
            <input
              type="text"
              value={piecesToSell}
              onChange={(e) =>
                setPiecesToSell(Number(e.target.value) ? e.target.value : "")
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("enterPieces")}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("pricePerArea")}:
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) =>
                setPrice(Number(e.target.value) ? e.target.value : "")
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("enterPrice")}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">{t("seller")}:</label>
            <input
              type="text"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("enterSellerName")}
            />
          </div>

          <button
            onClick={handleSell}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
          >
            {t("sell")}
          </button>
        </div>
      </div>
    </div>
  );
}

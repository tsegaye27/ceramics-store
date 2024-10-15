"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SellCeramic() {
  const [packetsToSell, setPacketsToSell] = useState<string>("0");
  const [piecesToSell, setPiecesToSell] = useState<string>("0");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const [ppp, setPpp] = useState<number>(0);

  useEffect(() => {
    const fetchCeramic = async () => {
      try {
        const ceramic = await axios.get(`/api/ceramics`, {
          params: {
            id,
          },
        });
        if (!ceramic) {
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

  const handleSell = async () => {
    let packets = Number(packetsToSell);
    let pieces = Number(piecesToSell);

    if (!validateInput(packetsToSell) || !validateInput(piecesToSell)) {
      setErrorMessage("Please enter valid positive numbers.");
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
        action: "sell",
      });
      router.push(`/ceramics`);
    } catch (error) {
      console.error("Error selling ceramic inventory:", error);
      setErrorMessage("Failed to update inventory.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          className="text-blue-600 hover:text-blue-800  mb-6 inline-block"
        >
          Back
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Sell Ceramic
        </h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Packets to Sell:</label>
            <input
              type="text"
              value={packetsToSell}
              onChange={(e) => setPacketsToSell(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the number of packets"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Pieces to Sell:</label>
            <input
              type="text"
              value={piecesToSell}
              onChange={(e) => setPiecesToSell(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the number of pieces"
            />
          </div>
          <button
            onClick={handleSell}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}

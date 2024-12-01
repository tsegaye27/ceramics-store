"use client";
import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/app/_lib/axios";

type SellCeramicProps = {
  params: {
    id: string;
  };
};

export default function SellCeramic({ params }: SellCeramicProps) {
  const [packetsToSell, setPacketsToSell] = useState("");
  const [piecesToSell, setPiecesToSell] = useState("");
  const [pricePerArea, setPricePerArea] = useState("");
  const [seller, setSeller] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function sellCeramic(
    ceramicId: string,
    packetsToSell: number,
    piecesToSell: number,
    pricePerArea: number,
    seller: string
  ) {
    try {
      await axiosInstance.patch(`/ceramics/sell`, {
        ceramicId,
        packetsSold: packetsToSell,
        piecesSold: piecesToSell,
        pricePerArea,
        seller,
      });
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }

  const handleSell = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const packets = parseInt(packetsToSell, 10);
    const pieces = parseInt(piecesToSell, 10);
    const price = parseFloat(pricePerArea);

    if (isNaN(packets) || isNaN(pieces) || isNaN(price) || !seller.trim()) {
      setErrorMessage("All fields are required and must be valid.");
      return;
    }

    try {
      await sellCeramic(params.id, packets, pieces, price, seller);
      setSuccessMessage("Ceramic sold successfully!");
      setPacketsToSell("");
      setPiecesToSell("");
      setPricePerArea("");
      setSeller("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          Back
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Sell Ceramic
        </h1>
        <div className="space-y-4">
          {errorMessage && (
            <div className="text-red-600 text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-600 text-center">{successMessage}</div>
          )}
          <form onSubmit={handleSell}>
            <div>
              <label className="block font-medium mb-1">Packets to Sell:</label>
              <input
                type="number"
                name="packetsToSell"
                value={packetsToSell}
                onChange={(e) => setPacketsToSell(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter packets"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Pieces to Sell:</label>
              <input
                type="number"
                name="piecesToSell"
                value={piecesToSell}
                onChange={(e) => setPiecesToSell(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pieces"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Price per Area:</label>
              <input
                type="number"
                step="0.01"
                name="pricePerArea"
                value={pricePerArea}
                onChange={(e) => setPricePerArea(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Seller:</label>
              <input
                type="text"
                name="seller"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seller name"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
            >
              Sell
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

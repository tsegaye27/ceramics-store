"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface ICeramic {
  _id: string;
  size: string;
  type: string;
  manufacturer: string;
  code: string;
  piecesPerPacket: number;
  totalPackets: number;
  totalPiecesWithoutPacket: number;
  totalArea?: number;
}

const CeramicsPage = () => {
  const [ceramics, setCeramics] = useState<ICeramic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCeramics = async () => {
      try {
        const response = await axios.get(`/api/ceramics?search=${searchQuery}`);
        const filteredCeramics = response.data.filter(
          (ceramic: ICeramic) =>
            ceramic.totalPackets > 0 || ceramic.totalPiecesWithoutPacket > 0
        );
        setCeramics(filteredCeramics);
      } catch (error) {
        console.error("Error fetching ceramics:", error);
      }
    };
    fetchCeramics();
  }, [searchQuery]);

  const calculateArea = (
    totalPackets: number,
    totalPiecesWithoutPacket: number,
    piecesPerPacket: number,
    size: string
  ) => {
    if (size === "60x60") {
      const area =
        totalPackets * piecesPerPacket * 0.36 + totalPiecesWithoutPacket * 0.36;
      return area.toFixed(2);
    }
    if (size === "30x60") {
      const area =
        totalPackets * piecesPerPacket * 0.18 + totalPiecesWithoutPacket * 0.18;
      return area.toFixed(2);
    }
    if (size === "30x30") {
      const area =
        totalPackets * piecesPerPacket * 0.09 + totalPiecesWithoutPacket * 0.09;
      return area.toFixed(2);
    }
    if (size === "40x40") {
      const area =
        totalPackets * piecesPerPacket * 0.16 + totalPiecesWithoutPacket * 0.16;
      return area.toFixed(2);
    }
    return "0.00";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Ceramics List</h1>
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search ceramics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-3 w-full mb-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Link href="/ceramics/add" className="text-blue-500 mb-6 inline-block">
          Add Ceramic
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ceramics.map((ceramic: ICeramic) => (
            <div
              key={ceramic._id}
              className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="font-bold text-xl mb-2">Code: {ceramic.code}</h2>
              <p className="text-gray-600">Size: {ceramic.size}</p>
              <p className="text-gray-600">Type: {ceramic.type}</p>
              <p className="text-gray-600 mb-4">
                Total Area:{" "}
                {calculateArea(
                  ceramic.totalPackets,
                  ceramic.totalPiecesWithoutPacket,
                  ceramic.piecesPerPacket,
                  ceramic.size
                )}{" "}
                m²
              </p>
              <Link href={`/ceramics/${ceramic._id}`} className="text-blue-500">
                View Details
              </Link>
              <div className="flex space-x-4 mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200">
                  <Link href={`/ceramics/add/${ceramic._id}`}>Add</Link>
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">
                  <Link href={`/ceramics/sell/${ceramic._id}`}>Sell</Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CeramicsPage;

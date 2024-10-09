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
        setCeramics(response.data);
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
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Ceramics List</h1>
      <input
        type="text"
        placeholder="Search ceramics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 my-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ceramics.map((ceramic: ICeramic) => (
          <div key={ceramic._id} className="border p-4">
            <h2 className="font-bold">Code: {ceramic.code}</h2>
            <p>Size: {ceramic.size}</p>
            <p>Total Packets: {ceramic.totalPackets}</p>
            <p>
              Total Pieces Without Packet: {ceramic.totalPiecesWithoutPacket}
            </p>
            <p>
              Total Area:{" "}
              {calculateArea(
                ceramic.totalPackets,
                ceramic.totalPiecesWithoutPacket,
                ceramic.piecesPerPacket,
                ceramic.size
              )}
              m2
            </p>
            <Link href={`/ceramics/${ceramic._id}`} className="text-blue-500">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CeramicsPage;

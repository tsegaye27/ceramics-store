"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
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
}

export default function CeramicDetail() {
  const [ceramic, setCeramic] = useState<ICeramic | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCeramicById = async () => {
      try {
        const res = await axios.get(`/api/ceramics?id=${id}`);
        setCeramic(res.data);
      } catch (error) {
        console.error("Error fetching ceramic by ID:", error);
      }
    };
    fetchCeramicById();
  }, [id]);

  if (!ceramic) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <Link
          href="/ceramics"
          className="text-blue-500 hover:text-blue-700  mb-6 inline-block"
        >
          Back
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center">Ceramic Details</h1>
        <div className="space-y-4">
          <div>
            <strong className="block font-medium">Size:</strong>
            <span className="text-gray-700">{ceramic.size}</span>
          </div>
          <div>
            <strong className="block font-medium">Type:</strong>
            <span className="text-gray-700">{ceramic.type}</span>
          </div>
          <div>
            <strong className="block font-medium">Manufacturer:</strong>
            <span className="text-gray-700">{ceramic.manufacturer}</span>
          </div>
          <div>
            <strong className="block font-medium">Code:</strong>
            <span className="text-gray-700">{ceramic.code}</span>
          </div>
          <div>
            <strong className="block font-medium">Pieces Per Packet:</strong>
            <span className="text-gray-700">{ceramic.piecesPerPacket}</span>
          </div>
          <div>
            <strong className="block font-medium">Total Packets:</strong>
            <span className="text-gray-700">{ceramic.totalPackets}</span>
          </div>
          <div>
            <strong className="block font-medium">
              Total Pieces Without Packet:
            </strong>
            <span className="text-gray-700">
              {ceramic.totalPiecesWithoutPacket}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

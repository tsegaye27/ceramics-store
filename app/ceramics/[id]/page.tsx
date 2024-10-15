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
  createdAt: string;
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
    return <p className="text-center mt-10 text-blue-400">Loading...</p>;
  }

  const formattedDate = new Date(ceramic.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href="/ceramics"
          className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
        >
          Back
        </Link>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          Ceramic Details
        </h1>
        <div className="space-y-4 text-blue-800">
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">Date:</strong>
            <span>{formattedDate}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">Size:</strong>
            <span>{ceramic.size}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">Type:</strong>
            <span>{ceramic.type}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              Manufacturer:
            </strong>
            <span>{ceramic.manufacturer}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">Code:</strong>
            <span>{ceramic.code}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              Pieces Per Packet:
            </strong>
            <span>{ceramic.piecesPerPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              Total Packets:
            </strong>
            <span>{ceramic.totalPackets}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              Total Pieces Without Packet:
            </strong>
            <span>{ceramic.totalPiecesWithoutPacket}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

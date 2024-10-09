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
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
        <Link href="/ceramics" className="text-blue-500">
            Back
        </Link>
      <h1 className="text-2xl font-bold mb-4">Ceramic Details</h1>
      <p>
        <strong>Size:</strong> {ceramic.size}
      </p>
      <p>
        <strong>Type:</strong> {ceramic.type}
      </p>
      <p>
        <strong>Manufacturer:</strong> {ceramic.manufacturer}
      </p>
      <p>
        <strong>Code:</strong> {ceramic.code}
      </p>
        <p>
            <strong>Pieces Per Packet:</strong> {ceramic.piecesPerPacket}
        </p>
        <p>
            <strong>Total Packets:</strong> {ceramic.totalPackets}
        </p>
        <p>
            <strong>Total Pieces Without Packet:</strong> {ceramic.totalPiecesWithoutPacket}
        </p>
    </div>
  );
}

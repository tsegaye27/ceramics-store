"use client";

import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCeramic() {
  const [packetsToAdd, setPacketsToAdd] = useState<string>("");
  const [piecesToAdd, setPiecesToAdd] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const validateInput = (value: string) => {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= 0 && /^\d+$/.test(value);
  };

  const handleAdd = async () => {
    const packets = Number(packetsToAdd);
    const pieces = Number(piecesToAdd);

    if (!validateInput(packetsToAdd) || !validateInput(piecesToAdd)) {
      setErrorMessage("Please enter valid positive numbers.");
      return;
    }

    try {
      await axios.patch(`/api/ceramics/`, {
        id,
        totalPackets: packets,
        totalPiecesWithoutPacket: pieces,
        action: "add",
      });
      router.push(`/ceramics/${id}`);
    } catch (error) {
      console.error("Error adding ceramic inventory:", error);
      setErrorMessage("Failed to update inventory.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics/${id}`}
          className="text-blue-600 hover:text-blue-800 underline mb-6 inline-block"
        >
          Back
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">Add Ceramic</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Packets to Add:</label>
            <input
              type="text"
              value={packetsToAdd}
              onChange={(e) => setPacketsToAdd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the number of packets"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Pieces to Add:</label>
            <input
              type="text"
              value={piecesToAdd}
              onChange={(e) => setPiecesToAdd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the number of pieces"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IFormData {
  size: string;
  type: string;
  manufacturer: string;
  code: string;
  piecesPerPacket: number;
  totalArea?: number;
  totalPackets: number;
  totalPiecesWithoutPacket: number;
  imageUrl?: string;
}
const AddCeramicPage = () => {
  const [formData, setFormData] = useState<IFormData>({
    size: "",
    type: "",
    manufacturer: "",
    code: "",
    piecesPerPacket: 0,
    totalPackets: 0,
    totalPiecesWithoutPacket: 0,
    totalArea: 0,
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/ceramics", formData);

      if (response.status === 201) {
        router.push("/ceramics");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Add New Ceramic</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Size</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Manufacturer</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Pieces Per Packet</label>
          <input
            type="number"
            name="piecesPerPacket"
            value={formData.piecesPerPacket}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Total Packets</label>
          <input
            type="number"
            name="totalPackets"
            value={formData.totalPackets}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">
            Total Pieces Without Packet
          </label>
          <input
            type="number"
            name="totalPiecesWithoutPacket"
            value={formData.totalPiecesWithoutPacket}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Ceramic
        </button>
      </form>
    </div>
  );
};

export default AddCeramicPage;

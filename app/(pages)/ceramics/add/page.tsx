"use client";

import { addNewCeramicAction } from "@/app/_lib/actions";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

const CeramicForm = () => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await addNewCeramicAction(formData);
        toast.success("Ceramic added successfully!");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message); // Show error message in toast
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <Link href="/ceramics" className="text-blue-500">
        Back
      </Link>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Add New Ceramic
      </h1>
      <form
        action={(formData) => handleSubmit(formData)}
        className="flex flex-col space-y-4"
      >
        <input
          type="text"
          name="size"
          placeholder="Size"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="ceramicType"
          placeholder="Ceramic Type"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="code"
          placeholder="Code"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="piecesPerPacket"
          placeholder="Pieces per Packet"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="totalPackets"
          placeholder="Total Packets"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="totalPiecesWithoutPacket"
          placeholder="Total Pieces Without Packet"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isPending}
        >
          {isPending ? "Adding..." : "Add Ceramic"}
        </button>
      </form>
    </div>
  );
};

export default CeramicForm;

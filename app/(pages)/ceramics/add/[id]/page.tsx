"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import Link from "next/link";
import axiosInstance from "@/app/_lib/axios";

type AddCeramicProps = {
  params: {
    id: string;
  };
};

export default function AddCeramic({ params }: AddCeramicProps) {
  const [packetsToAdd, setPacketsToAdd] = useState("");
  const [piecesToAdd, setPiecesToAdd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useAuth();
  
  async function addCeramic(
    ceramicId: string,
    packetsAdded: number,
    piecesAdded: number
  ) {
    try {
      const response = await axiosInstance.patch(`/ceramics/addById`, {
        ceramicId,
        packetsAdded,
        piecesAdded,
      });
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
  useEffect(()=>{
      async function checkUser(){
          const response = await axiosInstance.get('/getUser', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
      }
      checkUser()
  },[token])
  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const packetsAdded = parseInt(packetsToAdd);
    const piecesAdded = parseInt(piecesToAdd);

    if (isNaN(packetsAdded) || isNaN(piecesAdded)) {
      setErrorMessage("Both fields must be valid numbers.");
      return;
    }

    try {
      await addCeramic(params.id, packetsAdded, piecesAdded);
      setSuccessMessage("Ceramic updated successfully!");
      setPacketsToAdd("");
      setPiecesToAdd("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          Back
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">Add Ceramic</h1>
        <div className="space-y-4">
          {errorMessage && (
            <div className="text-red-600 text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-600 text-center">{successMessage}</div>
          )}
          <form onSubmit={handleAdd}>
            <div>
              <label className="block font-medium mb-1">Packets to Add:</label>
              <input
                type="text"
                name="packetsToAdd"
                value={packetsToAdd}
                onChange={(e) => setPacketsToAdd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter packets"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Pieces to Add:</label>
              <input
                type="text"
                name="piecesToAdd"
                value={piecesToAdd}
                onChange={(e) => setPiecesToAdd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pieces"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

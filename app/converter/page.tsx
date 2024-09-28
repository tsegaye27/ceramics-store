"use client";
import React, { FormEvent, useState } from "react";

export default function Converter() {
  const [step, setStep] = useState(1);
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [manufacturer, setManufacturer] = useState("");

  const [byPacket, setByPacket] = useState(0);
  const [byPiece, setByPiece] = useState(0);
  const [pieceConversion, setPieceConversion] = useState(0.36);
  const [packetConversion, setPacketConversion] = useState(1.44);
  const [area, setArea] = useState(0);

  const handleNextStep = () => {
    if (size && type && manufacturer) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const calculateArea = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = byPacket * packetConversion + byPiece * pieceConversion;
    if (result % 1 !== 0) {
      setArea(Number(result.toFixed(2)));
      return;
    }
    setArea(result);
  };

  return (
    <form onSubmit={step === 2 ? calculateArea : (e) => e.preventDefault()}>
      {step === 1 ? (
        <div className="flex flex-col  my-8 gap-4 max-w-md mx-auto p-6 bg-white ring ring-blue-500 rounded-lg">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Size</option>
              <option value="60x60">60x60</option>
              <option value="40x40">40x40</option>
              <option value="30x60">30x60</option>
              <option value="30x30">30x30</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Type</option>
              {size === "60x60" && (
                <>
                  <option value="polished">Polished</option>
                  <option value="rough">Rough</option>
                </>
              )}
              {size === "40x40" && (
                <>
                  <option value="smooth">Smooth</option>
                  <option value="textured">Textured</option>
                </>
              )}
              {/* Add more types based on sizes */}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Manufacturer:
            </label>
            <select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Manufacturer</option>
              <option value="Dukem">Dukem</option>
              <option value="Arerti">Arerti</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleNextStep}
            className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="flex flex-col  my-8 gap-4 max-w-md mx-auto p-6 bg-white ring ring-blue-500 rounded-lg">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">By Packet:</label>
            <input
              type="text"
              placeholder="0"
              value={byPacket}
              onChange={(e) => setByPacket(Number(e.target.value))}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">By Piece:</label>
            <input
              type="text"
              placeholder="0"
              value={byPiece}
              onChange={(e) => setByPiece(Number(e.target.value))}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Piece Conversion:
            </label>
            <input
              type="number"
              placeholder="0"
              value={pieceConversion}
              onChange={(e) => setPieceConversion(Number(e.target.value))}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Packet Conversion:
            </label>
            <input
              type="number"
              placeholder="0"
              value={packetConversion}
              onChange={(e) => setPacketConversion(Number(e.target.value))}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-row justify-between mt-4">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
            >
              Go Back
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Calculate Area
            </button>
          </div>
          <div className="flex flex-col mt-4">
            <label className="text-gray-700 font-medium mb-1">Area:</label>
            <span className="p-2 border rounded-md">{area}</span>
          </div>
        </div>
      )}
    </form>
  );
}

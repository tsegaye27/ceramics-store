"use client";
import React from "react";

export default function Converter() {
  const [byPacket, setByPacket] = React.useState(0);
  const [byPiece, setByPiece] = React.useState(0);
  const [pieceConversion, setPieceConversion] = React.useState(0.36);
  const [packetConversion, setPacketConversion] = React.useState(1.44);
  const [area, setArea] = React.useState(0);

  const calculateArea = () => {
    const result = byPacket * packetConversion + byPiece * pieceConversion;
    // if the result has more than 2 decimal places round it to 2 decimal places
    if (result % 1 !== 0) {
      setArea(Number(result.toFixed(2)));
      return;
    }
    setArea(result);
  };

  function handleByPacketChange(e: React.ChangeEvent<HTMLInputElement>) {
    // if the input is a character other than number and empty set it to 0
    if (isNaN(Number(e.target.value)) || e.target.value === "") {
      setByPacket(0);
      return;
    }
    setByPacket(Number(e.target.value));
  }
  function handleByPieceChange(e: React.ChangeEvent<HTMLInputElement>) {
    // if the input is a character other than number and empty set it to 0
    if (isNaN(Number(e.target.value)) || e.target.value === "") {
      setByPiece(0);
      return;
    }
    setByPiece(Number(e.target.value));
  }
  function handlePieceConversionChange(e: React.ChangeEvent<HTMLInputElement>) {
    // if the input is a character other than number and empty set it to 0
    if (isNaN(Number(e.target.value)) || e.target.value === "") {
      setPieceConversion(0);
      return;
    }
    setPieceConversion(Number(e.target.value));
  }
  function handlePacketConversionChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    // if the input is a character other than number and empty set it to 0
    if (isNaN(Number(e.target.value)) || e.target.value === "") {
      setPacketConversion(0);
      return;
    }
    setPacketConversion(Number(e.target.value));
  }

  return (
    <>
      <div className="flex flex-col  my-8 gap-4 max-w-md mx-auto p-6 bg-white ring ring-blue-500 rounded-lg">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">By Packet:</label>
          <input
            type="text"
            placeholder="0"
            value={byPacket}
            onChange={(e) => handleByPacketChange(e)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">By Piece:</label>
          <input
            type="text"
            placeholder="0"
            value={byPiece}
            onChange={(e) => handleByPieceChange(e)}
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
            onChange={(e) => handlePieceConversionChange(e)}
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
            onChange={(e) => handlePacketConversionChange(e)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          type="button"
          onClick={calculateArea}
          className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Calculate Area
        </button>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Area:</label>
          <span className="p-2 border rounded-md">{area}</span>
        </div>
      </div>
    </>
  );
}

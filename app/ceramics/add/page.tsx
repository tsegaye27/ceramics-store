"use client";
import { useState } from "react";

const CeramicForm = () => {
  const [formData, setFormData] = useState({
    size: "",
    type: "",
    manufacturer: "",
    code: "",
    piecesPerPacket: "",
    totalPackets: "",
    totalPiecesWithoutPacket: "",
  });
  const [showSizeList, setShowSizeList] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);
  const [showManufacturerList, setShowManufacturerList] = useState(false);

  const sizes = ["60x60", "40x40", "30x30", "30x60"];
  const types = {
    "60x60": ["polished", "normal"],
    "40x40": ["normal"],
    "30x60": ["digital", "normal"],
    "30x30": ["normal"],
  };
  const manufacturers = ["arerti", "dukem"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = (list: string[], query: string) =>
    list?.filter((item: string) =>
      item.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Add New Ceramic
      </h1>
      <form className="flex flex-col space-y-4">
        {/* Size Input */}
        <div className="relative">
          <input
            type="text"
            name="size"
            placeholder="Size"
            value={formData.size}
            onChange={handleChange}
            onFocus={() => setShowSizeList(true)}
            onBlur={() => setTimeout(() => setShowSizeList(false), 200)}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSizeList && (
            <ul className="absolute bg-white border border-gray-300 w-full max-h-40 overflow-y-auto z-10 rounded-md shadow-lg">
              {handleSearch(sizes, formData.size).map((size) => (
                <li
                  key={size}
                  onClick={() => {
                    setFormData((prevData) => ({ ...prevData, size }));
                    setShowSizeList(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {size}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Type Input */}
        {formData.size && (
          <div className="relative">
            <input
              type="text"
              name="type"
              placeholder="Type"
              value={formData.type}
              onChange={handleChange}
              onFocus={() => setShowTypeList(true)}
              onBlur={() => setTimeout(() => setShowTypeList(false), 200)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showTypeList && (
              <ul className="absolute bg-white border border-gray-300 w-full max-h-40 overflow-y-auto z-10 rounded-md shadow-lg">
                {handleSearch(types[formData.size], formData.type).map(
                  (type) => (
                    <li
                      key={type}
                      onClick={() => {
                        setFormData((prevData) => ({ ...prevData, type }));
                        setShowTypeList(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {type}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        )}

        {/* Manufacturer Input */}
        <div className="relative">
          <input
            type="text"
            name="manufacturer"
            placeholder="Manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            onFocus={() => setShowManufacturerList(true)}
            onBlur={() => setTimeout(() => setShowManufacturerList(false), 200)}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showManufacturerList && (
            <ul className="absolute bg-white border border-gray-300 w-full max-h-40 overflow-y-auto z-10 rounded-md shadow-lg">
              {handleSearch(manufacturers, formData.manufacturer).map(
                (manufacturer) => (
                  <li
                    key={manufacturer}
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        manufacturer,
                      }));
                      setShowManufacturerList(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {manufacturer}
                  </li>
                )
              )}
            </ul>
          )}
        </div>

        {/* Additional Inputs */}
        <input
          type="text"
          name="code"
          placeholder="Code"
          value={formData.code}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="piecesPerPacket"
          placeholder="Pieces Per Packet"
          value={formData.piecesPerPacket}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="totalPackets"
          placeholder="Total Packets"
          value={formData.totalPackets}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="totalPiecesWithoutPacket"
          placeholder="Total Pieces Without Packet"
          value={formData.totalPiecesWithoutPacket}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Add Ceramic
        </button>
      </form>
    </div>
  );
};

export default CeramicForm;

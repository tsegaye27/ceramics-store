"use client";

import { useLanguage } from "@/app/_context/LanguageContext";
import axiosInstance from "@/app/_lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const dummySizes = ["60x60", "40x40", "30x60", "30x30", "Zekolo"];
const dummyTypes = ["Polished", "Normal", "Digital"];
const dummyManufacturers = ["Arerti", "Dukem", "China"];

const CeramicForm = () => {
  const languageContext = useLanguage();
  const t = languageContext?.t;
  const [formData, setFormData] = useState({
    size: "",
    type: "",
    manufacturer: "",
    code: "",
    piecesPerPacket: "",
    totalPackets: "",
    totalPiecesWithoutPacket: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      const res = await axiosInstance.post("/ceramics/addNew", {
        ...formData,
        piecesPerPacket: Number(formData.piecesPerPacket),
        totalPackets: Number(formData.totalPackets),
        totalPiecesWithoutPacket: Number(formData.totalPiecesWithoutPacket),
      });
      setSuccess("Ceramic added successfully");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      setFormData({
        size: "",
        type: "",
        manufacturer: "",
        code: "",
        piecesPerPacket: "",
        totalPackets: "",
        totalPiecesWithoutPacket: "",
      });
      router.push("/ceramics");
    } catch (err: any) {
      setError(err.response?.data.error || "Internal server error");
    } finally {
      setLoading(false);
      if (error) {
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  const [filteredSizes, setFilteredSizes] = useState(dummySizes);
  const [filteredTypes, setFilteredTypes] = useState(dummyTypes);
  const [filteredManufacturers, setFilteredManufacturers] =
    useState(dummyManufacturers);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showManufacturerDropdown, setShowManufacturerDropdown] =
    useState(false);

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "size" | "type" | "manufacturer"
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, [type]: value });

    if (type === "size") {
      setFilteredSizes(
        dummySizes.filter((size) =>
          size.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowSizeDropdown(value.length > 0); // Show dropdown if input has text
    } else if (type === "type") {
      setFilteredTypes(
        dummyTypes.filter((itemType) =>
          itemType.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowTypeDropdown(value.length > 0); // Show dropdown if input has text
    } else if (type === "manufacturer") {
      setFilteredManufacturers(
        dummyManufacturers.filter((manufacturer) =>
          manufacturer.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowManufacturerDropdown(value.length > 0); // Show dropdown if input has text
    }
  };

  const handleFocus = (type: "size" | "type" | "manufacturer") => {
    if (type === "size") {
      setShowSizeDropdown(true);
    } else if (type === "type") {
      setShowTypeDropdown(true);
    } else if (type === "manufacturer") {
      setShowManufacturerDropdown(true);
    }
  };

  const handleSelect = (
    value: string,
    type: "size" | "type" | "manufacturer"
  ) => {
    setFormData({ ...formData, [type]: value });
    if (type === "size") {
      setShowSizeDropdown(false);
    } else if (type === "type") {
      setShowTypeDropdown(false);
    } else if (type === "manufacturer") {
      setShowManufacturerDropdown(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <Link href="/ceramics" className="text-blue-500">
        {t("back")}
      </Link>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {t("addCeramic")}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* Dropdown for Size */}
        <div className="relative">
          <input
            type="text"
            name="size"
            onChange={(e) => handleDropdownChange(e, "size")}
            onFocus={() => handleFocus("size")}
            value={formData.size}
            disabled={loading}
            placeholder={t("size")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSizeDropdown && filteredSizes.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-auto">
              {filteredSizes.map((size) => (
                <li
                  key={size}
                  onClick={() => handleSelect(size, "size")}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {size}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dropdown for Type */}
        <div className="relative">
          <input
            type="text"
            name="type"
            onChange={(e) => handleDropdownChange(e, "type")}
            onFocus={() => handleFocus("type")}
            value={formData.type}
            disabled={loading}
            placeholder={t("type")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showTypeDropdown && filteredTypes.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-auto">
              {filteredTypes.map((itemType) => (
                <li
                  key={itemType}
                  onClick={() => handleSelect(itemType, "type")}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {itemType}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dropdown for Manufacturer */}
        <div className="relative">
          <input
            type="text"
            name="manufacturer"
            onChange={(e) => handleDropdownChange(e, "manufacturer")}
            onFocus={() => handleFocus("manufacturer")}
            value={formData.manufacturer}
            disabled={loading}
            placeholder={t("manufacturer")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showManufacturerDropdown && filteredManufacturers.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-auto">
              {filteredManufacturers.map((manufacturer) => (
                <li
                  key={manufacturer}
                  onClick={() => handleSelect(manufacturer, "manufacturer")}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {manufacturer}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Other input fields */}
        <input
          type="text"
          name="code"
          onChange={handleChange}
          value={formData.code}
          disabled={loading}
          placeholder={t("code")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="piecesPerPacket"
          onChange={handleChange}
          value={formData.piecesPerPacket}
          disabled={loading}
          placeholder={t("piecesPerPacket")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="totalPackets"
          onChange={handleChange}
          value={formData.totalPackets}
          disabled={loading}
          placeholder={t("totalPackets")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="totalPiecesWithoutPacket"
          onChange={handleChange}
          value={formData.totalPiecesWithoutPacket}
          disabled={loading}
          placeholder={t("totalPiecesWithoutPacket")}
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out`}
        >
          {loading ? "Adding Ceramic..." : `${t("addNewCeramic")}`}
        </button>
      </form>
    </div>
  );
};

export default CeramicForm;

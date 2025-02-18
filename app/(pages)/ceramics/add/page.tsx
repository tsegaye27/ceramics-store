"use client";

import { useLanguage } from "@/app/_context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/_features/store/store";
import { uploadImage, addCeramic } from "@/app/_features/ceramics/slice";
import { ICeramic } from "@/app/_types/types";
import { toast } from "react-hot-toast";

const sizes = ["60x60", "40x40", "30x60", "30x30", "Zekolo"];
const types = ["Polished", "Normal", "Digital"];
const manufacturers = ["Arerti", "Dukem", "China"];

const CeramicForm = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ceramics);
  const router = useRouter();

  const [formData, setFormData] = useState<ICeramic>({
    size: "",
    type: "",
    manufacturer: "",
    code: "",
    piecesPerPacket: 0,
    totalPackets: 0,
    totalPiecesWithoutPacket: 0,
    imageUrl: "",
  });

  const [filteredSizes, setFilteredSizes] = useState(sizes);
  const [filteredTypes, setFilteredTypes] = useState(types);
  const [filteredManufacturers, setFilteredManufacturers] =
    useState(manufacturers);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showManufacturerDropdown, setShowManufacturerDropdown] =
    useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const result = await dispatch(uploadImage(file));
      if (uploadImage.fulfilled.match(result)) {
        setFormData({ ...formData, imageUrl: result.payload });
      }
    }
  };

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "size" | "type" | "manufacturer",
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, [type]: value });

    if (type === "size") {
      setFilteredSizes(
        sizes.filter((size) =>
          size.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setShowSizeDropdown(value.length > 0);
    } else if (type === "type") {
      setFilteredTypes(
        types.filter((itemType) =>
          itemType.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setShowTypeDropdown(value.length > 0);
    } else if (type === "manufacturer") {
      setFilteredManufacturers(
        manufacturers.filter((manufacturer) =>
          manufacturer.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setShowManufacturerDropdown(value.length > 0);
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
    type: "size" | "type" | "manufacturer",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ceramicData = {
      ...formData,
      piecesPerPacket: Number(formData.piecesPerPacket),
      totalPackets: Number(formData.totalPackets),
      totalPiecesWithoutPacket: Number(formData.totalPiecesWithoutPacket),
    };
    try {
      const result = await dispatch(addCeramic(ceramicData));
      if (addCeramic.fulfilled.match(result)) {
        toast.success("Ceramic added successfully");
        router.push("/ceramics");
      } else if (addCeramic.rejected.match(result)) {
        toast.error((result.payload as string) || "Failed to add ceramic");
      }
    } catch (err: any) {
      toast.error(err.message || "unexpected error occured");
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
        <div className="relative">
          <label htmlFor="size" className="block mb-2 text-gray-700">
            {t("size")}
          </label>
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

        <div className="relative">
          <label htmlFor="type" className="block mb-2 text-gray-700">
            {t("type")}
          </label>
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

        <div className="relative">
          <label htmlFor="manufacturer" className="block mb-2 text-gray-700">
            {t("manufacturer")}
          </label>
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

        <div>
          <label htmlFor="code" className="block mb-2 text-gray-700">
            {t("code")}
          </label>
          <input
            type="text"
            name="code"
            onChange={handleChange}
            value={formData.code}
            disabled={loading}
            placeholder={t("code")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="piecesPerPacket" className="block mb-2 text-gray-700">
            {t("piecesPerPacket")}
          </label>
          <input
            type="text"
            name="piecesPerPacket"
            onChange={handleChange}
            value={formData.piecesPerPacket}
            disabled={loading}
            placeholder={t("piecesPerPacket")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="totalPackets" className="block mb-2 text-gray-700">
            {t("totalPackets")}
          </label>
          <input
            type="text"
            name="totalPackets"
            onChange={handleChange}
            value={formData.totalPackets}
            disabled={loading}
            placeholder={t("totalPackets")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="totalPiecesWithoutPacket"
            className="block mb-2 text-gray-700"
          >
            {t("totalPiecesWithoutPacket")}
          </label>
          <input
            type="text"
            name="totalPiecesWithoutPacket"
            onChange={handleChange}
            value={formData.totalPiecesWithoutPacket}
            disabled={loading}
            placeholder={t("totalPiecesWithoutPacket")}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-gray-700">{t("uploadImage")}</label>
          <div className="w-48 h-48 border-dashed border-2 border-gray-300 flex justify-center items-center rounded-md relative overflow-hidden">
            {formData.imageUrl || imagePreview ? (
              <Image
                src={imagePreview || formData.imageUrl || "/placeholder.png"}
                alt="Image Preview"
                width={192}
                height={192}
                className="object-cover"
              />
            ) : (
              <p className="text-gray-500">{t("selectImage")}</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out`}
        >
          {loading ? t("addingCeramic") : t("addNewCeramic")}
        </button>
      </form>
    </div>
  );
};

export default CeramicForm;

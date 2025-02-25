"use client";

import { useLanguage } from "@/app/_context/LanguageContext";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/_features/store/store";
import { uploadImage, addCeramic } from "@/app/_features/ceramics/slice";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCeramicSchema,
  CeramicFormData,
} from "@/app/_validators/ceramicSchema";

const sizes = ["60x60", "40x40", "30x60", "30x30", "Zekolo"];
const types = ["Polished", "Normal", "Digital"];
const manufacturers = ["Arerti", "Dukem", "China"];

const CeramicForm = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ceramics);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false); // Track upload status

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CeramicFormData>({
    resolver: zodResolver(createCeramicSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showManufacturerDropdown, setShowManufacturerDropdown] =
    useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true); // Start upload
      try {
        const result = await dispatch(uploadImage(file));
        if (uploadImage.fulfilled.match(result)) {
          setValue("imageUrl", result.payload);
          toast.success("Image uploaded successfully");
        } else if (uploadImage.rejected.match(result)) {
          toast.error("Failed to upload image: " + (result.payload || "Unknown error"));
        }
      } catch (err) {
        toast.error("An unexpected error occurred during upload");
      } finally {
        setIsUploading(false); // End upload
      }
    }
  };

  const handleBack = () => {
    startTransition(() => {
      router.push("/ceramics");
    });
  };

  const onSubmit = async (data: CeramicFormData) => {
    if (!data.imageUrl) {
      toast.error("Please upload an image before submitting");
      return;
    }

    console.log("form data", data);
    try {
      const result = await dispatch(addCeramic(data));
      if (addCeramic.fulfilled.match(result)) {
        toast.success("Ceramic added successfully");
        reset();
        router.push("/ceramics");
      } else if (addCeramic.rejected.match(result)) {
        toast.error((result.payload as string) || "An unexpected error occurred");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <button onClick={handleBack} className="text-blue-500">
        {t("back")}
      </button>
      <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-4 md:mb-6">
        {t("addCeramic")}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Left Column */}
            <div className="space-y-4">
              {/* Size Field */}
              <div className="relative">
                <label htmlFor="size" className="block mb-2 text-gray-700">
                  {t("size")}
                </label>
                <Controller
                  name="size"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        id="size"
                        value={field.value || ""}
                        onFocus={() => setShowSizeDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSizeDropdown(false), 200)
                        }
                        className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showSizeDropdown && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto">
                          {sizes
                            .filter((size) =>
                              size
                                .toLowerCase()
                                .includes(field.value.toLowerCase()),
                            )
                            .map((size) => (
                              <li
                                key={size}
                                onMouseDown={() => {
                                  setValue("size", size);
                                  setShowSizeDropdown(false);
                                }}
                                className="p-2 hover:bg-blue-100 cursor-pointer"
                              >
                                {size}
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  )}
                />
                {errors.size && (
                  <p className="text-red-500 text-sm">{errors.size.message}</p>
                )}
              </div>

              {/* Type Field */}
              <div className="relative">
                <label htmlFor="type" className="block mb-2 text-gray-700">
                  {t("type")}
                </label>
                <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        id="type"
                        value={field.value || ""}
                        onFocus={() => setShowTypeDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowTypeDropdown(false), 200)
                        }
                        className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showTypeDropdown && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto">
                          {types
                            .filter((type) =>
                              type
                                .toLowerCase()
                                .includes(field.value.toLowerCase()),
                            )
                            .map((type) => (
                              <li
                                key={type}
                                onMouseDown={() => {
                                  setValue("type", type);
                                  setShowTypeDropdown(false);
                                }}
                                className="p-2 hover:bg-blue-100 cursor-pointer"
                              >
                                {type}
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>

              {/* Manufacturer Field */}
              <div className="relative">
                <label
                  htmlFor="manufacturer"
                  className="block mb-2 text-gray-700"
                >
                  {t("manufacturer")}
                </label>
                <Controller
                  name="manufacturer"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        id="manufacturer"
                        value={field.value || ""}
                        onFocus={() => setShowManufacturerDropdown(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setShowManufacturerDropdown(false),
                            200,
                          )
                        }
                        className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showManufacturerDropdown && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto">
                          {manufacturers
                            .filter((manufacturer) =>
                              manufacturer
                                .toLowerCase()
                                .includes(field.value.toLowerCase()),
                            )
                            .map((manufacturer) => (
                              <li
                                key={manufacturer}
                                onMouseDown={() => {
                                  setValue("manufacturer", manufacturer);
                                  setShowManufacturerDropdown(false);
                                }}
                                className="p-2 hover:bg-blue-100 cursor-pointer"
                              >
                                {manufacturer}
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  )}
                />
                {errors.manufacturer && (
                  <p className="text-red-500 text-sm">
                    {errors.manufacturer.message}
                  </p>
                )}
              </div>

              {/* Code Field */}
              <div>
                <label htmlFor="code" className="block mb-2 text-gray-700">
                  {t("code")}
                </label>
                <input
                  id="code"
                  {...register("code")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code.message}</p>
                )}
              </div>

              {/* Pieces Per Packet Field */}
              <div>
                <label
                  htmlFor="piecesPerPacket"
                  className="block mb-2 text-gray-700"
                >
                  {t("piecesPerPacket")}
                </label>
                <input
                  id="piecesPerPacket"
                  type="number"
                  {...register("piecesPerPacket")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.piecesPerPacket && (
                  <p className="text-red-500 text-sm">
                    {errors.piecesPerPacket.message}
                  </p>
                )}
              </div>

              {/* Total Packets Field */}
              <div>
                <label
                  htmlFor="totalPackets"
                  className="block mb-2 text-gray-700"
                >
                  {t("totalPackets")}
                </label>
                <input
                  id="totalPackets"
                  type="number"
                  {...register("totalPackets")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.totalPackets && (
                  <p className="text-red-500 text-sm">
                    {errors.totalPackets.message}
                  </p>
                )}
              </div>

              {/* Total Pieces Without Packet Field */}
              <div>
                <label
                  htmlFor="totalPiecesWithoutPacket"
                  className="block mb-2 text-gray-700"
                >
                  {t("totalPiecesWithoutPacket")}
                </label>
                <input
                  id="totalPiecesWithoutPacket"
                  type="number"
                  {...register("totalPiecesWithoutPacket")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.totalPiecesWithoutPacket && (
                  <p className="text-red-500 text-sm">
                    {errors.totalPiecesWithoutPacket.message}
                  </p>
                )}
              </div>
            </div>
            {/* Right Column */}
            <div className="relative">
              <label htmlFor="image" className="block mb-2 text-gray-700">
                {t("uploadImage")}
              </label>
              <div className="w-full h-48 md:h-64 border-dashed border-2 border-gray-300 flex justify-center items-center rounded-md relative overflow-hidden">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      width={256}
                      height={256}
                      className="object-cover w-full h-full"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="h-8 w-8 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">{t("selectImage")}</p>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading || isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {errors.imageUrl && (
                <p className="text-red-500 text-sm">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isUploading} // Disable during upload
              className={`w-full py-2 md:py-3 ${
                loading || isUploading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out`}
            >
              {loading || isUploading ? t("addingCeramic") : t("addNewCeramic")}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default CeramicForm;

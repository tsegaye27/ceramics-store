"use client";

import { useLanguage } from "@/app/_context/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
import { Loader } from "@/app/_components/Loader";
import withAuth from "@/app/_components/hoc/withAuth";
import { useAuth } from "@/app/_context/AuthContext";

const sizes = ["60x60", "40x40", "30x60", "30x30", "Zekolo"];
const types = ["Polished", "Normal", "Digital"];
const manufacturers = ["Arerti", "Dukem", "China"];

const CeramicForm = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ceramics);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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
  const { token, user, loading: contextLoading } = useAuth();

  useEffect(() => {
    if (!token && !contextLoading) {
      router.replace("/login");
      return;
    } else if (user.role !== "admin") {
      router.replace("/not-found");
      return;
    }
    setIsChecked(true);
  }, [token, user, router, contextLoading]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true);
      try {
        const result = await dispatch(uploadImage(file));
        if (uploadImage.fulfilled.match(result)) {
          setValue("imageUrl", result.payload);
        } else if (uploadImage.rejected.match(result)) {
          toast.error(
            "Failed to upload image: " + (result.payload || "Unknown error"),
          );
        }
      } catch (err) {
        toast.error("An unexpected error occurred during upload");
      } finally {
        setIsUploading(false);
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

    try {
      const result = await dispatch(addCeramic(data));
      if (addCeramic.fulfilled.match(result)) {
        toast.success("Ceramic added successfully");
        reset();
        router.push("/ceramics");
      } else if (addCeramic.rejected.match(result)) {
        toast.error(
          (result.payload as string) || "An unexpected error occurred",
        );
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  if (!isChecked) {
    return <Loader />;
  }
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-900">
      {isPending ? (
        <Loader />
      ) : (
        <>
          <button
            onClick={handleBack}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          >
            {t("back")}
          </button>
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-4 md:mb-6 dark:text-gray-200">
            {t("addCeramic")}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            <div className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="size"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
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
                        value={t(field.value) || ""}
                        onFocus={() => setShowSizeDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSizeDropdown(false), 200)
                        }
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 dark:text-white"
                        placeholder={t("selectSize")}
                      />
                      {showSizeDropdown && (
                        <ul className="absolute z-10 dark:bg-gray-700 bg-white border border-gray-300 dark:border-gray-600 w-full max-h-40 overflow-y-auto rounded-md shadow-lg">
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
                                className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer dark:text-gray-200"
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
                  <p className="text-red-500 text-sm dark:text-red-400">
                    {errors.size.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="type"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
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
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 dark:text-white"
                        placeholder={t("selectType")}
                      />
                      {showTypeDropdown && (
                        <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full max-h-40 overflow-y-auto rounded-md shadow-lg">
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
                                className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer dark:text-gray-200"
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
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="manufacturer"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
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
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 dark:text-white"
                        placeholder={t("selectManufacturer")}
                      />
                      {showManufacturerDropdown && (
                        <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full max-h-40 overflow-y-auto rounded-md shadow-lg">
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
                                className="p-2 hover:bg-blue-100 cursor-pointer dark:hover:bg-gray-600 dark:text-gray-200"
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
                  <p className="text-red-500 text-sm dark:text-red-400">
                    {errors.manufacturer.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t("code")}
                </label>
                <input
                  id="code"
                  {...register("code")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 bg-white"
                  placeholder={t("enterCode")}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm dark:text-red-400">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="piecesPerPacket"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t("piecesPerPacket")}
                </label>
                <input
                  id="piecesPerPacket"
                  type="number"
                  min="2"
                  {...register("piecesPerPacket")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 bg-white"
                  placeholder={t("enterPiecesPerPacket")}
                />
                {errors.piecesPerPacket && (
                  <p className="text-red-500 text-sm dark:text-red-400">
                    {errors.piecesPerPacket.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="totalPackets"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t("totalPackets")}
                </label>
                <input
                  id="totalPackets"
                  type="number"
                  min="1"
                  {...register("totalPackets")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 bg-white"
                  placeholder={t("enterTotalPackets")}
                />
                {errors.totalPackets && (
                  <p className="text-red-500 text-sm dark:text-red-400">
                    {errors.totalPackets.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="totalPiecesWithoutPacket"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  {t("totalPiecesWithoutPacket")}
                </label>
                <input
                  id="totalPiecesWithoutPacket"
                  min="0"
                  type="number"
                  {...register("totalPiecesWithoutPacket")}
                  className="border border-gray-300 rounded-md p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 bg-white"
                  placeholder={t("enterTotalPiecesWithoutPacket")}
                />
                {errors.totalPiecesWithoutPacket && (
                  <p className="text-red-500 text-sm dark:text-red-400">
                    {errors.totalPiecesWithoutPacket.message}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="image"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                {t("uploadImage")}
              </label>
              <div className="w-full h-48 md:h-64 border-dashed border-2 border-gray-300 dark:border-gray-600 flex justify-center items-center rounded-md relative overflow-hidden bg-gray-50 dark:bg-gray-900">
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
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("selectImage")}
                  </p>
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
                <p className="text-red-500 text-sm dark:text-red-400">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || isUploading}
              className={`w-full py-2 md:py-3 ${
                loading || isUploading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out`}
            >
              {loading ? t("adding") : t("addNewCeramic")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default withAuth(CeramicForm, ["admin"]);

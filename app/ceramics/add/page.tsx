"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLanguage } from "@/app/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "@/app/store/userSlice";
import { RootState } from "@/app/store/store";
import { jwtDecode } from "jwt-decode";
import Spinner from "@/app/components/Spinner";

const CeramicForm = () => {
  const { token } = useAuth();
  const router = useRouter();
  const { t, switchLanguage } = useLanguage();
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.global);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) {
        setLoading(true);
        router.push("/auth/login");
        return;
      }

      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          setLoading(true);
          router.push("/auth/login");
        }
      } catch (error) {
        setLoading(true);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 43200 * 1000);

    return () => clearInterval(interval);
  }, [token, router]);

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
    "60x60": ["Polished", "Normal"],
    "40x40": ["Normal"],
    "30x60": ["Digital", "Normal"],
    "30x30": ["Normal"],
  };
  const manufacturers = ["Arerti", "Dukem"];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let packets = Number(formData.totalPackets);
    let pieces = Number(formData.totalPiecesWithoutPacket);
    while (pieces >= Number(formData.piecesPerPacket)) {
      packets += 1;
      pieces -= Number(formData.piecesPerPacket);
    }
    try {
      const response = await axios.post(
        "/api/ceramics",
        {
          ...formData,
          totalPackets: packets,
          totalPiecesWithoutPacket: pieces,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to add ceramic");
      }

      setFormData({
        size: "",
        type: "",
        manufacturer: "",
        code: "",
        piecesPerPacket: "",
        totalPackets: "",
        totalPiecesWithoutPacket: "",
      });
      setLoading(true);
      router.push("/ceramics");

      dispatch(setError(""));
    } catch (error: any) {
      dispatch(
        setError(error.response.data.error || "An unexpected error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <button onClick={() => switchLanguage("en")} className="mr-2">
        English
      </button>
      <button onClick={() => switchLanguage("am")} className="mr-2">
        አማርኛ
      </button>
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <Link href="/ceramics" className="text-blue-500">
          {t("back")}
        </Link>
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {t("addNewCeramic")}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              name="size"
              placeholder={t("size")}
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

          {formData.size && (
            <div className="relative">
              <input
                type="text"
                name="type"
                placeholder={t("type")}
                value={formData.type}
                onChange={handleChange}
                onFocus={() => setShowTypeList(true)}
                onBlur={() => setTimeout(() => setShowTypeList(false), 200)}
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showTypeList && (
                <ul className="absolute bg-white border border-gray-300 w-full max-h-40 overflow-y-auto z-10 rounded-md shadow-lg">
                  {handleSearch(
                    (types as any)[formData.size],
                    formData.type
                  ).map((type) => (
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
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              name="manufacturer"
              placeholder={t("manufacturer")}
              value={formData.manufacturer}
              onChange={handleChange}
              onFocus={() => setShowManufacturerList(true)}
              onBlur={() =>
                setTimeout(() => setShowManufacturerList(false), 200)
              }
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

          <input
            type="text"
            name="code"
            placeholder={t("code")}
            value={formData.code}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="piecesPerPacket"
            placeholder={t("piecesPerPacket")}
            value={formData.piecesPerPacket}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="totalPackets"
            placeholder={t("totalPackets")}
            value={formData.totalPackets}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="totalPiecesWithoutPacket"
            placeholder={t("totalPiecesWithoutPacket")}
            value={formData.totalPiecesWithoutPacket}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            {t("addCeramic")}
          </button>
        </form>
      </div>
    </>
  );
};

export default CeramicForm;

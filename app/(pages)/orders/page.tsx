"use client";
import { useEffect, useState, useTransition, useCallback } from "react";
import {
  calculateArea,
  calculateTotalPrice as totalPrice,
  calculateTotalArea as totalArea,
} from "@/app/_utils/helperFunctions";
import { IOrder } from "@/app/_types/types";
import { useLanguage } from "@/app/_context/LanguageContext";
import { useAppDispatch } from "@/app/_features/store/store";
import { useRouter } from "next/navigation";
import { fetchOrders } from "@/app/_features/orders/slice";
import toast from "react-hot-toast";

const OrderList = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [searchOrderQuery, setSearchOrderQuery] = useState<string>("");
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await dispatch(fetchOrders()).unwrap();
        setOrders(result.data);
        setFilteredOrders(result.data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchOrderQuery(term);
      const lowerCaseTerm = term.toLowerCase();
      const filtered = orders.filter((order) => {
        const matchesSearch =
          order.seller?.toLowerCase().includes(lowerCaseTerm) ||
          order.userId.name?.toLowerCase().includes(lowerCaseTerm) ||
          order.ceramicId?.code?.toLowerCase().includes(lowerCaseTerm);
        const matchesSize = selectedSize
          ? order.ceramicId?.size === selectedSize
          : true;
        const matchesDate = selectedDate
          ? new Date(order.createdAt).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString()
          : true;
        const matchesSeller = selectedSeller
          ? order.seller === selectedSeller
          : true;
        return matchesSearch && matchesSize && matchesDate && matchesSeller;
      });
      setFilteredOrders(filtered);
    },
    [orders, selectedSize, selectedDate, selectedSeller],
  );

  useEffect(() => {
    handleSearch(searchOrderQuery);
  }, [
    searchOrderQuery,
    selectedSize,
    selectedDate,
    selectedSeller,
    handleSearch,
  ]);

  const calculateTotalPrice = totalPrice(filteredOrders);
  const calculateTotalArea = totalArea(filteredOrders);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6">
      {isPending ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-16 w-16 border-8 border-t-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <button
              onClick={handleBack}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t("back")}
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {t("orderList")}
            </h1>
            <div></div> {/* Empty div for spacing */}
          </div>

          {/* Search Bar and Filters */}
          <div className="mb-6 md:mb-8">
            <input
              type="text"
              placeholder={t("search")}
              value={searchOrderQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-4">
            <select
              onChange={(e) => setSelectedSize(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">All Sizes</option>
              {["60x60", "40x40", "30x60"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="Filter by seller"
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500">{t("noOrdersFound")}</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      No
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      Ceramic
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      Seller
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      Time
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      Total Area
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      Total Price
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {order.ceramicId?.size} ({order.ceramicId?.code})
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {order.seller}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {order.createdAt &&
                          new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {calculateArea(
                          order.packets,
                          order.pieces,
                          order.ceramicId?.piecesPerPacket ?? 0,
                          order.ceramicId?.size ?? 0,
                        )}{" "}
                        m²
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {(
                          order.price *
                          Number(
                            calculateArea(
                              order.packets,
                              order.pieces,
                              order.ceramicId?.piecesPerPacket ?? 0,
                              order.ceramicId?.size ?? 0,
                            ),
                          )
                        ).toFixed(2)}{" "}
                        birr
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b">
                        {order.userId.name}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={4}
                      className="py-3 px-4 md:py-4 md:px-6 text-right"
                    >
                      Total:
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      {calculateTotalArea} m²
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      {calculateTotalPrice.toFixed(2)} birr
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;

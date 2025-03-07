"use client";
import { useEffect, useState, useTransition, useCallback } from "react";
import {
  calculateArea,
  calculateTotalPrice as totalPrice,
  calculateTotalArea as totalArea,
} from "@/app/_utils/helperFunctions";
import { IOrder } from "@/app/_types/types";
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/_features/store/store";
import { useRouter } from "next/navigation";
import { fetchOrders } from "@/app/_features/orders/slice";
import toast from "react-hot-toast";
import { Loader } from "@/app/_components/Loader";
import withAuth from "@/app/_components/hoc/withAuth";
import { useAuth } from "@/app/_context/AuthContext";

const OrderList = () => {
  const { orders, loading: isLoading } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [searchOrderQuery, setSearchOrderQuery] = useState<string>("");
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const { token, user, loading } = useAuth();
  const [isChecked, setIsChecked] = useState(false);

  const handleBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  useEffect(() => {
    if (!token && !loading) {
      router.push("/login");
      return;
    } else if (user.role === "user") {
      router.push("/ceramics");
      return;
    }
    setIsChecked(true);
    async function fetchData() {
      try {
        const result = await dispatch(fetchOrders()).unwrap();
        setFilteredOrders(result.data);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchData();
  }, [dispatch, router, token, user.role, loading]);

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

  if (!isChecked) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6">
      {isPending || isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <button
              onClick={handleBack}
              className="text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:text-blue-700 flex items-center"
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {t("orderList")}
            </h1>
            <div></div>
          </div>

          <div className="mb-6 md:mb-8">
            <input
              type="text"
              placeholder={t("search")}
              value={searchOrderQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 md:p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-4">
            <select
              onChange={(e) => setSelectedSize(e.target.value)}
              className="p-2 border rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">{t("allSizes")}</option>
              {["60x60", "40x40", "30x60", "30x30", "zekolo"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <input
              type="date"
              placeholder={t("filterByDate")}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />

            <input
              type="text"
              placeholder={t("filterBySeller")}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t("noOrdersYet")}
            </p>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("no")}
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("ceramic")}
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("seller")}
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("time")}
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("totalArea")}
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("totalPrice")}
                    </th>
                    <th className="py-3 px-4 md:py-4 md:px-6 text-left text-gray-600 font-medium dark:text-gray-300">
                      {t("user")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 md:py-4 md:px-6 border-bdark:border-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b dark:border-gray-700">
                        {order.ceramicId?.size} ({order.ceramicId?.code})
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b dark:border-gray-700">
                        {order.seller}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b dark:border-gray-700">
                        {order.createdAt &&
                          new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b dark:border-gray-700">
                        {calculateArea(
                          order.packets,
                          order.pieces,
                          order.ceramicId?.piecesPerPacket ?? 0,
                          order.ceramicId?.size ?? 0,
                        )}{" "}
                        m²
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b dark:border-gray-700">
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
                        {t("birr")}
                      </td>
                      <td className="py-3 px-4 md:py-4 md:px-6 border-b dark:border-gray-700">
                        {order.userId.name}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold dark:bg-gray-700">
                    <td
                      colSpan={4}
                      className="py-3 px-4 md:py-4 md:px-6 text-right"
                    >
                      {t("total")}:
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      {calculateTotalArea.toFixed(2)} m²
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      {calculateTotalPrice.toFixed(2)} {t("birr")}
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

export default withAuth(OrderList, ["admin"]);

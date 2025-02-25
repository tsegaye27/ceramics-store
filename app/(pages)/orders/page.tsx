"use client";

import { useEffect, useState, useTransition } from "react";
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

  const handleBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await dispatch(fetchOrders()).unwrap();
        setOrders(result);
        setFilteredOrders(result);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchData();
  }, [dispatch]);

  const handleSearch = (term: string) => {
    setSearchOrderQuery(term);
    const lowerCaseTerm = term.toLowerCase();
    const filtered = orders.filter((order) => {
      return (
        order.seller?.toLowerCase().includes(lowerCaseTerm) ||
        order.userId.name?.toLowerCase().includes(lowerCaseTerm) ||
        order.ceramicId?.code?.toLowerCase().includes(lowerCaseTerm)
      );
    });
    setFilteredOrders(filtered);
  };

  const calculateTotalPrice = totalPrice(filteredOrders);
  const calculateTotalArea = totalArea(filteredOrders);

  return (
    <div className="container mx-auto p-4">
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
          <button
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
          >
            {t("back")}
          </button>
          <h1 className="text-3xl font-bold mb-6 text-center">
            {t("orderList")}
          </h1>

          {/* Search Bar */}
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              placeholder={
                t("search") || "Search by seller, user, or ceramic code"
              }
              value={searchOrderQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-center">{t("noOrdersFound")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      No
                    </th>
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      Ceramic
                    </th>
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      Seller
                    </th>
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      Time
                    </th>
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      Total Area
                    </th>
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      Total Price
                    </th>
                    <th className="py-3 px-4 border-b border-r-2 font-medium">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 border-b border-r-2">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 border-b border-r-2">
                        {order.ceramicId?.size} ({order.ceramicId?.code})
                      </td>
                      <td className="py-3 px-4 border-b border-r-2">
                        {order.seller}
                      </td>
                      <td className="py-3 px-4 border-b border-r-2">
                        {order.createdAt &&
                          new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b border-r-2">
                        {calculateArea(
                          order.packets,
                          order.pieces,
                          order.ceramicId?.piecesPerPacket ?? 0,
                          order.ceramicId?.size ?? 0,
                        )}{" "}
                        m²
                      </td>
                      <td className="py-3 px-4 border-b border-r-2">
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
                      <td className="py-3 px-4 border-b border-r-2">
                        {order.userId.name}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan={4} className="py-3 px-4 border-t text-right">
                      Total:
                    </td>
                    <td className="py-3 px-4 border-t">
                      {calculateTotalArea} m2
                    </td>

                    <td className="py-3 px-4 border-t">
                      {calculateTotalPrice.toFixed(2)} birr
                    </td>
                    <td className="border-t"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;

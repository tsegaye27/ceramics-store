
"use client";

import { useEffect, useState } from "react";
import { calculateArea } from "@/app/_utils/helperFunctions";
import Link from "next/link";
import axiosInstance from "@/app/_lib/axios";
import { IOrder } from "@/app/_types/types";
import { useLanguage } from "@/app/_context/LanguageContext";
import logger from "@/app/_utils/logger";
import Loading from "./loading";
 const OrderList = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const { t } = useLanguage();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/getOrders");
        if (Array.isArray(res.data)) {
          setOrders(res.data);
          logger.info("Orders fetched successfully", res.data);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loading />; // Show the loading spinner
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/ceramics"
        className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
      >
        {t("back")}
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">{t("orderList")}</h1>
      {orders.length === 0 ? (
        <p className="text-center">{t("noOrdersYet")}</p>
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
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 border-b border-r-2">{index + 1}</td>
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
                      order.ceramicId?.size ?? 0
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
                          order.ceramicId?.size ?? 0
                        )
                      )
                    ).toFixed(2)}{" "}
                    birr
                  </td>
                  <td className="py-3 px-4 border-b border-r-2">
                    {order.userId.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;

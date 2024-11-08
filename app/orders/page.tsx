"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useLanguage } from "../_context/LanguageContext";
import Spinner from "../_components/Spinner";

interface Order {
  _id: string;
  ceramicId: { code: string; size: string; piecesPerPacket: string };
  userId: { name: string };
  seller: string;
  pieces: number;
  packets: number;
  price: number;
  createdAt: string;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t, switchLanguage } = useLanguage();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/orders");
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sell orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateArea = (
    totalPackets: number,
    totalPiecesWithoutPacket: number,
    piecesPerPacket: string,
    size: string
  ) => {
    const ppp = Number(piecesPerPacket);
    if (size === "60x60") {
      const area = totalPackets * ppp * 0.36 + totalPiecesWithoutPacket * 0.36;

      return area.toFixed(2);
    }
    if (size === "30x60") {
      const area = totalPackets * ppp * 0.18 + totalPiecesWithoutPacket * 0.18;

      return area.toFixed(2);
    }
    if (size === "30x30") {
      const area = totalPackets * ppp * 0.09 + totalPiecesWithoutPacket * 0.09;

      return area.toFixed(2);
    }
    if (size === "40x40") {
      const area = totalPackets * ppp * 0.16 + totalPiecesWithoutPacket * 0.16;

      return area.toFixed(2);
    }
    return "0.00";
  };

  if (isLoading)
    return (
      <div className="h-screen">
        <Spinner />;
      </div>
    );
  return (
    <div className="container mx-auto p-4">
      <button onClick={() => switchLanguage("en")} className="mr-2">
        English
      </button>
      <button onClick={() => switchLanguage("am")} className="mr-2">
        አማርኛ
      </button>
      <br />
      <Link
        href="/ceramics"
        onClick={() => setLoading(true)}
        className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
      >
        {t("back")}
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">{t("orderList")}</h1>
      {orders.length === 0 ? (
        <p className="text-center">{t("noOrdersYet")}</p>
      ) : isLoading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  {t("ceramic")}
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  {t("seller")}
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  {t("time")}
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  {t("totalArea")}
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  {t("totalPrice")}
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  {t("user")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 border-b border-r-2">
                    {order.ceramicId.size}({order.ceramicId.code})
                  </td>
                  <td className="py-3 px-4 border-b border-r-2">
                    {order.seller}
                  </td>
                  <td className="py-3 px-4 border-b border-r-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b border-r-2">
                    {calculateArea(
                      order.packets,
                      order.pieces,
                      order.ceramicId.piecesPerPacket,
                      order.ceramicId.size
                    )}{" "}
                    {t("m")}²
                  </td>
                  <td className="py-3 px-4 border-b border-r-2">
                    {order.price *
                      Number(
                        calculateArea(
                          order.packets,
                          order.pieces,
                          order.ceramicId.piecesPerPacket,
                          order.ceramicId.size
                        )
                      )}{" "}
                    {t("birr")}
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

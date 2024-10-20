"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Order {
  _id: string;
  ceramicId: { code: string };
  userId: { name: string };
  seller: string;
  pieces: number;
  packets: number;
  createdAt: string;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/orders");
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sell orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Link href="/ceramics">Back</Link>
      <h1 className="text-2xl font-semibold mb-4">Sell Orders</h1>

      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Ceramic</th>
                <th className="py-2 px-4 border-b">Seller</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Pieces</th>
                <th className="py-2 px-4 border-b">Packets</th>
                <th className="py-2 px-4 border-b">User</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.ceramicId.code}</td>
                  <td>{order.seller}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.pieces}</td>
                  <td>{order.packets}</td>
                  <td>{order.userId.name}</td>
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

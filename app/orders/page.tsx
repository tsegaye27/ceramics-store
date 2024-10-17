import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  _id: string;
  ceramicId: { name: string };
  seller: { name: string };
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
        const response = await axios.get("/api/sell-orders");
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
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{order.ceramicId.name}</td>
                  <td className="py-2 px-4 border-b">{order.seller.name}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">{order.pieces}</td>
                  <td className="py-2 px-4 border-b">{order.packets}</td>
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

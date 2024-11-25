import { calculateArea } from "@/app/_utils/helperFunctions";
import Link from "next/link";

const OrderList = async () => {
  return (
    <div className="container mx-auto p-4">
      <Link
        href="/ceramics"
        className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
      >
        back
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">orderList</h1>
      {orders.length === 0 ? (
        <p className="text-center">noOrdersYet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  No
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  ceramic
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  seller
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  time
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  totalArea
                </th>
                <th className="py-3 px-4 border-b border-r-2 font-medium">
                  totalPrice
                </th>
                {/* <th className="py-3 px-4 border-b border-r-2 font-medium">
                  user
                </th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map(
                (order, index) =>
                  typeof order.ceramicId === "object" && (
                    <tr
                      key={order.ceramicId._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 border-b border-r-2">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 border-b border-r-2">
                        {order.ceramicId.size}({order.ceramicId.code})
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
                          order.ceramicId.piecesPerPacket,
                          order.ceramicId.size
                        )}{" "}
                        m²
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
                        birr
                      </td>
                      {/* <td className="py-3 px-4 border-b border-r-2">
                    {order.userId.name}
                  </td> */}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;

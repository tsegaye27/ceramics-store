import { serviceSellCeramic } from "@/app/_services/ceramicsService";
import { serviceCreateOrder } from "@/app/_services/ordersService";
import Link from "next/link";

export default function SellCeramic({ params }: { params: { id: string } }) {
  const handleSell = async (formData: FormData) => {
    "use server";
    const packetsToSell = parseInt(formData.get("packetsToSell") as string, 10);
    const piecesToSell = parseInt(formData.get("piecesToSell") as string, 10);
    const pricePerArea = parseInt(formData.get("pricePerArea") as string, 10);
    const seller = formData.get("seller") as string;

    if (!packetsToSell || !piecesToSell || !pricePerArea || !seller) {
      return "Please fill all the fields";
    }

    await serviceCreateOrder({
      ceramicId: params.id,
      pieces: piecesToSell,
      packets: packetsToSell,
      seller,
      price: pricePerArea,
    });

    await serviceSellCeramic(params.id, {
      totalPackets: packetsToSell,
      totalPiecesWithoutPacket: piecesToSell,
    });

    return;
  };
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          className="text-blue-600 hover:text-blue-800  mb-6 inline-block"
        >
          back
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">sellCeramic</h1>
        <div className="space-y-4">
          <form action={handleSell}>
            <div>
              <label className="block font-medium mb-1">packetsToSell:</label>
              <input
                type="text"
                name="packetsToSell"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enterPackets"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">piecesToSell:</label>
              <input
                type="text"
                name="piecesToSell"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enterPieces"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">pricePerArea:</label>
              <input
                type="text"
                name="pricePerArea"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enterPrice"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">seller:</label>
              <input
                type="text"
                name="seller"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enterSellerName"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300">
              sell
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

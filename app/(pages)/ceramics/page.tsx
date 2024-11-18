import { getCeramicsAction } from "@/app/_lib/actions";
import { ICeramics } from "@/app/_models/ceramics/types";
import {
  serviceGetAllCeramics,
  serviceSearchCeramics,
} from "@/app/_services/ceramicsService";
import { calculateArea } from "@/app/_utils/helperFunctions";
import Link from "next/link";

const CeramicsPage = async ({ searchParams }: CeramicsPageProps) => {
  const searchQuery = searchParams?.search || "";
  const ceramics = await getCeramicsAction(searchQuery);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        ceramicsList
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="flex">
          <form method="get" className="w-full">
            <input
              type="text"
              name="search"
              placeholder="searchCeramics"
              defaultValue={searchQuery}
              className="border border-blue-300 p-3 w-full mb-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="hidden"
              aria-hidden="true"
            ></button>
          </form>
        </div>
        <div className="w-4xl flex justify-between">
          <Link
            href="/ceramics/add"
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
          >
            addNewCeramic
          </Link>
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
          >
            orderList
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ceramics.map((ceramic: ICeramics) => (
            <div
              key={ceramic._id}
              className={`bg-white p-5 rounded-lg ${
                ceramic.totalPackets <= 10
                  ? "border-2 border-red-600 shadow-lg"
                  : "shadow-lg"
              } hover:transition-shadow duration-300`}
            >
              <h2 className="font-bold text-xl text-blue-800 mb-2">
                code: {ceramic.code}
              </h2>
              <p>size: {ceramic.size}</p>
              <p>type: {ceramic.type}</p>
              <p className="mb-4">
                totalArea:{" "}
                {calculateArea(
                  ceramic.totalPackets,
                  ceramic.totalPiecesWithoutPacket,
                  ceramic.piecesPerPacket,
                  ceramic.size
                )}{" "}
                {ceramic.size === "zekolo" ? "m" : "m²"}
              </p>
              <Link
                href={`/ceramics/${ceramic._id}`}
                className="text-blue-500 hover:text-blue-600"
              >
                viewDetails
              </Link>
              <div className="flex space-x-4 mt-4">
                <Link
                  href={`/ceramics/add/${ceramic._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-200"
                >
                  add
                </Link>
                <Link
                  href={`/ceramics/sell/${ceramic._id}`}
                  className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  sell
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CeramicsPage;

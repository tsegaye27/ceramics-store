import { ICeramics } from "@/app/_models/ceramics/types";
import { serviceAddNewCeramic } from "@/app/_services/ceramicsService";
import logger from "@/app/_utils/logger";
import Link from "next/link";

const CeramicForm = () => {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const size = formData.get("size") as string;
    const manufacturer = formData.get("manufacturer") as string;
    const code = formData.get("code") as string;
    const piecesPerPacket = parseInt(
      formData.get("piecesPerPacket") as string,
      10
    );
    const totalPackets = parseInt(formData.get("totalPackets") as string, 10);
    const totalPiecesWithoutPacket = parseInt(
      formData.get("totalPiecesWithoutPacket") as string,
      10
    );
    const ceramicType = formData.get("ceramicType") as string;

    if (
      !size ||
      !manufacturer ||
      !code ||
      !ceramicType ||
      !piecesPerPacket ||
      !totalPackets ||
      !totalPiecesWithoutPacket
    ) {
      throw new Error("Please fill all the fields");
      // logger.warn("Please fill all the fields");
    }

    const ceramic: ICeramics = {
      size,
      manufacturer,
      code,
      piecesPerPacket,
      totalPackets,
      totalPiecesWithoutPacket,
      type: ceramicType,
    };
    return await serviceAddNewCeramic(ceramic);
  };
  return (
    <>
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <Link href="/ceramics" className="text-blue-500">
          back
        </Link>
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          addNewCeramic
        </h1>
        <form action={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              name="size"
              placeholder="size"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="ceramicType"
              name="ceramicType"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="manufacturer"
              name="manufacturer"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            name="code"
            placeholder="code"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="piecesPerPacket"
            placeholder="piecesPerPacket"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="totalPackets"
            placeholder="totalPackets"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="totalPiecesWithoutPacket"
            placeholder="totalPiecesWithoutPacket"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            addCeramic
          </button>
        </form>
      </div>
    </>
  );
};
export default CeramicForm;

import { serviceAddToExistingCeramic } from "@/app/_services/ceramicsService";
import Link from "next/link";

export default function AddCeramic({ params }: { params: { id: string } }) {
  const handleAdd = async (formData: FormData) => {
    "use server";
    const packetsToAdd = parseInt(formData.get("packetsToAdd") as string, 10);
    const piecesToAdd = parseInt(formData.get("piecesToAdd") as string, 10);

    if (!packetsToAdd || !piecesToAdd) {
      return "Missing packets or pieces";
    }

    if (packetsToAdd < 0 || piecesToAdd < 0) {
      return "Invalid packets or pieces";
    }
    return await serviceAddToExistingCeramic(params.id, {
      packetsToAdd,
      piecesToAdd,
    });
  };
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href={`/ceramics`}
          className="text-blue-600 hover:text-blue-800  mb-6 inline-block"
        >
          back
        </Link>
        <h1 className="text-3xl font-semibold mb-6 text-center">addCeramic</h1>
        <div className="space-y-4">
          <form action={handleAdd}>
            <div>
              <label className="block font-medium mb-1">packetsToAdd:</label>
              <input
                type="text"
                name="packetsToAdd"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enterPackets"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">piecesToAdd:</label>
              <input
                type="text"
                name="piecesToAdd"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="enterPieces"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
            >
              add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

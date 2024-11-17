import Link from "next/link";
import { ICeramics } from "@/app/_models/ceramics/types";
import { formatDate } from "@/app/_utils/helperFunctions";
import { getCeramicById } from "@/app/_services/ceramicsService";

export default async function CeramicDetail({
  params,
}: {
  params: { id: string };
}) {
  const ceramic: ICeramics | null = await getCeramicById(params.id);
  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Link
          href="/ceramics"
          className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
        >
          back
        </Link>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          ceramicDetails
        </h1>
        <div className="space-y-4 text-blue-800">
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">date:</strong>
            <span>
              {ceramic?.createdAt && formatDate(ceramic?.createdAt.toString())}
            </span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">size:</strong>
            <span>{ceramic?.size}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">type:</strong>
            <span>{ceramic?.type}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              manufacturer:
            </strong>
            <span>{ceramic?.manufacturer}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">code:</strong>
            <span>{ceramic?.code}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              piecesPerPacket:
            </strong>
            <span>{ceramic?.piecesPerPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              totalPackets:
            </strong>
            <span>{ceramic?.totalPackets}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              totalPiecesWithoutPacket:
            </strong>
            <span>{ceramic?.totalPiecesWithoutPacket}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
            <strong className="block font-semibold text-blue-900">
              updatedAt:
            </strong>
            <span>
              {ceramic?.updatedAt && formatDate(ceramic?.updatedAt.toString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

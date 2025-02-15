import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { ICeramic } from "@/app/_types/types";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { createCeramicSchema } from "../../_validators/ceramicSchema";
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const ceramicData: ICeramic = await req.json();
    const createCeramicData = ceramicData;
    const validation = createCeramicSchema.safeParse(createCeramicData);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      createCeramicData;

    const { packets, pieces } = formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      piecesPerPacket,
    );

    const newCeramic = new Ceramic({
      ...ceramicData,
      totalPackets: packets,
      totalPiecesWithoutPacket: pieces,
    });

    const savedCeramic = await newCeramic.save();

    return successResponse(savedCeramic, "Ceramic created successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

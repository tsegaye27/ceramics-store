import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { ICeramic } from "@/app/_types/types";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const ceramicData: ICeramic = await req.json();
    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      ceramicData;

    if (!totalPackets || !totalPiecesWithoutPacket || !piecesPerPacket ) {
      return errorResponse("All fields are required", 400);
    }

    const { packets, pieces } = formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      piecesPerPacket
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

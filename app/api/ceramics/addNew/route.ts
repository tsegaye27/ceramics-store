import { ICeramic } from "@/app/_types/types";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { createCeramicSchema } from "@/app/_validators/ceramicSchema";
import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models";
import { NextRequest } from "next/server";
import { checkPermission } from "../../_utils/checkPermission";
import { decodeToken } from "../../_utils/decodeToken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const tokenResult = decodeToken(req);

    if (!tokenResult?.decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!checkPermission(tokenResult?.decodedToken, "admin")) {
      return errorResponse("You don't have permission to create ceramic", 403);
    }

    const ceramicData: ICeramic = await req.json();
    const validation = createCeramicSchema.safeParse(ceramicData);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      validation.data;
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
    if (error.code === 11000) {
      return errorResponse("Ceramic already exists", 400);
    }
    return errorResponse(error.message, 500);
  }
}

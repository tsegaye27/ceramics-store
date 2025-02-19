import { ICeramic } from "@/app/_types/types";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { createCeramicSchema } from "@/app/_validators/ceramicSchema";
import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextRequest } from "next/server";
import { checkPermission } from "../../_utils/checkPermission";
import { decodeToken } from "../../_utils/decodeToken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const decodedToken = decodeToken(req);

    if (!decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (checkPermission(decodedToken, "admin")) {
      return errorResponse("You don't have permission to create ceramic", 403);
    }

    // Parse and validate request body
    const ceramicData: ICeramic = await req.json();
    const validation = createCeramicSchema.safeParse(ceramicData);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    // Format ceramic data
    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      validation.data;
    const { packets, pieces } = formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      piecesPerPacket,
    );

    // Save new ceramic entry
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

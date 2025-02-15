import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { soldCeramicSchema } from "../../_validators/ceramicSchema";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.headers.get("Authorization");
    const soldCeramicData = await req.json();
    const validation = soldCeramicSchema.safeParse(soldCeramicData);

    if (!token || !token.includes("Bearer")) {
      return errorResponse("Unauthorized", 401);
    }

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { ceramicId, packetsSold, piecesSold } = soldCeramicData;

    const ceramic = await Ceramic.findById(ceramicId);
    if (!ceramic) {
      return errorResponse("Ceramic not found", 404);
    }

    let { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } = ceramic;

    let pieces = piecesSold;
    let packets = packetsSold;

    if (pieces >= piecesPerPacket) {
      packets += Math.floor(pieces / piecesPerPacket);
      pieces = pieces % piecesPerPacket;
    }

    if (packets > totalPackets) {
      return errorResponse("Not enough stock", 400);
    }

    if (pieces > totalPiecesWithoutPacket && totalPackets - packets <= 0) {
      return errorResponse("Not enough stock", 400);
    }

    if (pieces > totalPiecesWithoutPacket && totalPackets - packets > 0) {
      totalPackets -= 1;
      totalPiecesWithoutPacket += piecesPerPacket;
    }

    totalPackets -= packets;
    totalPiecesWithoutPacket -= pieces;

    ceramic.totalPackets = totalPackets;
    ceramic.totalPiecesWithoutPacket = totalPiecesWithoutPacket;

    await ceramic.save();

    return successResponse(ceramic, "Ceramic stock updated successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

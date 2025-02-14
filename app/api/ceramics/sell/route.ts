import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.headers.get("Authorization");
    const { ceramicId, packetsSold, piecesSold } = await req.json();
    
    if(!token || !token.includes("Bearer")) {
      return errorResponse("Unauthorized", 401);
    }

    if (!ceramicId || !packetsSold || !piecesSold) {
      return errorResponse("All fields are required", 400);
    }

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

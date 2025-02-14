import { Ceramic } from "@/app/api/_models/Ceramics";
import dbConnect from "@/app/api/_lib/mongoose";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function PATCH(req: NextRequest) {
  try {
    const { ceramicId, packetsAdded, piecesAdded } = await req.json();

    if (!ceramicId || packetsAdded == null || piecesAdded == null) {
      return errorResponse("All fields are required", 400);
    }

    await dbConnect();

    const ceramic = await Ceramic.findById(ceramicId);
    if (!ceramic) {
      return errorResponse("Ceramic not found", 404);
    }

    let packets = ceramic.totalPackets + packetsAdded;
    let pieces = ceramic.totalPiecesWithoutPacket + piecesAdded;

    if (pieces >= ceramic.piecesPerPacket) {
      packets += Math.floor(pieces / ceramic.piecesPerPacket);
      pieces = pieces % ceramic.piecesPerPacket;
    }

    ceramic.totalPackets = packets;
    ceramic.totalPiecesWithoutPacket = pieces;

    const saved = await ceramic.save();

    return successResponse(saved, "Ceramic stock updated successfully");
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}

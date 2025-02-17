import { Ceramic } from "@/app/api/_models/Ceramics";
import dbConnect from "@/app/api/_lib/mongoose";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { updateCeramicSchema } from "../../_validators/ceramicSchema";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const addCeramicData = await req.json();
    const validation = updateCeramicSchema.safeParse(addCeramicData);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { ceramicId, packetsAdded, piecesAdded } = validation.data;

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

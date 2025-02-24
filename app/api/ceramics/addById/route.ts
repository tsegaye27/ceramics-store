import { Ceramic } from "@/app/api/_models/Ceramics";
import dbConnect from "@/app/api/_lib/mongoose";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { updateCeramicSchema } from "@/app/_validators/ceramicSchema";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";

export async function PATCH(req: NextRequest) {
  try {
    const addCeramicData = await req.json();
    const validation = updateCeramicSchema.safeParse(addCeramicData);
    const ceramicId = new URL(req.url).searchParams.get("ceramicId");
    const tokenResult = decodeToken(req);

    if (!tokenResult?.decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!checkPermission(tokenResult?.decodedToken, "admin")) {
      return errorResponse("You don't have permission to update ceramic", 403);
    }

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { packetsAdded, piecesAdded } = validation.data;

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

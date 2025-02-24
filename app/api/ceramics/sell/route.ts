import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { soldCeramicSchema } from "@/app/_validators/ceramicSchema";
import { decodeToken } from "@/app/api/_utils/decodeToken";
import { checkPermission } from "@/app/api/_utils/checkPermission";
import { Order } from "../../_models/Orders";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const soldCeramicData = await req.json();
    const ceramicId = new URL(req.url).searchParams.get("ceramicId");
    const validation = soldCeramicSchema.safeParse(soldCeramicData);
    const tokenResult = decodeToken(req);

    if (!tokenResult?.decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!checkPermission(tokenResult?.decodedToken, "admin")) {
      return errorResponse("You don't have permission to sell ceramic", 403);
    }

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { packetsSold, piecesSold, pricePerArea, seller } = validation.data;

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

    let price = pricePerArea;
    let userId = tokenResult?.decodedToken?.id;

    await Order.create({
      ceramicId,
      userId,
      packets,
      pieces,
      price,
      seller,
    });

    return successResponse(ceramic, "Ceramic sold successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

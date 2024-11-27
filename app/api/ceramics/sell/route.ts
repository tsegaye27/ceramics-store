import dbConnect from "@/app/_lib/mongoose";
import { Ceramic } from "@/app/_models/Ceramics";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { ceramicId, packetsSold, piecesSold } = await req.json();
    const ceramic = await Ceramic.findById(ceramicId);
    if (!ceramic) throw new Error("Ceramic not found");

    const { packets, pieces } = formatPieces(
      packetsSold,
      piecesSold,
      ceramic.piecesPerPacket
    );

    if (packets > ceramic.totalPackets) {
      throw new Error("Not enough stock");
    }

    if (pieces > ceramic.totalPiecesWithoutPacket && ceramic.totalPackets > 0) {
      ceramic.totalPackets--;
      ceramic.totalPiecesWithoutPacket += ceramic.piecesPerPacket;
    } else {
      throw new Error("Not enough stock");
    }

    ceramic.totalPackets -= packets;
    ceramic.totalPiecesWithoutPacket -= pieces;

    return await ceramic.save();
  } catch (error: any) {
    throw new Error(error.message || "An unknown error occurred");
  }
}

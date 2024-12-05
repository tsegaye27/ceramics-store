import dbConnect from "@/app/_lib/mongoose";
import { Ceramic } from "@/app/_models/Ceramics";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.headers.get("Authorization");
    const { ceramicId, packetsSold, piecesSold } = await req.json();

    if (!ceramicId || !packetsSold || !piecesSold) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const ceramic = await Ceramic.findById(ceramicId);
    if (!ceramic) throw new Error("Ceramic not found");

    let { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } = ceramic;

    let pieces = piecesSold;
    let packets = packetsSold;

    if (pieces >= piecesPerPacket) {
      packets += Math.floor(pieces / piecesPerPacket);
      pieces = pieces % piecesPerPacket;
    }

    if (packets > totalPackets) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    if (pieces > totalPiecesWithoutPacket && totalPackets - packets <= 0) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
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

    return NextResponse.json(
      { message: "Ceramic stock updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

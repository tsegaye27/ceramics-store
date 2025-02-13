import { Ceramic } from "@/app/api/_models/Ceramics";
import dbConnect from "@/app/api/_lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { ceramicId, packetsAdded, piecesAdded } = await req.json();

    if (!ceramicId || packetsAdded == null || piecesAdded == null) {
      return NextResponse.json(
        { error: "ceramicId, packetsAdded, and piecesAdded are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const ceramic = await Ceramic.findById(ceramicId);
    if (!ceramic) {
      return NextResponse.json({ error: "Ceramic not found" }, { status: 404 });
    }

    let packets = ceramic.totalPackets + packetsAdded;
    let pieces = ceramic.totalPiecesWithoutPacket + piecesAdded;

    if (pieces >= ceramic.piecesPerPacket) {
      packets += Math.floor(pieces / ceramic.piecesPerPacket);
      pieces = pieces % ceramic.piecesPerPacket;
    }

    ceramic.totalPackets = packets;
    ceramic.totalPiecesWithoutPacket = pieces;

    await ceramic.save();

    return NextResponse.json(
      {
        message: "Ceramic updated successfully",
        data: ceramic,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}

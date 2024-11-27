import dbConnect from "@/app/_lib/mongoose";
import { Ceramic } from "@/app/_models/Ceramics";
import { ICeramic } from "@/app/_types/types";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const ceramicData: ICeramic = await req.json();
    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      ceramicData;

    if (!totalPackets || !totalPiecesWithoutPacket || !piecesPerPacket) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { packets, pieces } = formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      piecesPerPacket
    );

    const newCeramic = new Ceramic({
      ...ceramicData,
      totalPackets: packets,
      totalPiecesWithoutPacket: pieces,
    });

    const savedCeramic = await newCeramic.save();

    return NextResponse.json(savedCeramic, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

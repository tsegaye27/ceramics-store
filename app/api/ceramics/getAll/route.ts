import dbConnect from "@/app/_lib/mongoose";
import { Ceramic } from "@/app/_models/Ceramics";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const ceramics = await Ceramic.find({});

    return NextResponse.json(ceramics, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

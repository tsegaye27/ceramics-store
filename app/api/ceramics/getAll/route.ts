import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const ceramics = await Ceramic.find({}).limit(100);
    return NextResponse.json(ceramics, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

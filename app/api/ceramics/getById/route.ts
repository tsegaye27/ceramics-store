import dbConnect from "@/app/_lib/mongoose";
import { Ceramic } from "@/app/_models/Ceramics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const ceramicId = searchParams.get("ceramicId");

    if (!ceramicId) {
      return NextResponse.json(
        { error: "ceramicId query parameter is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const ceramic = await Ceramic.findById(ceramicId);

    if (!ceramic) {
      return NextResponse.json({ error: "Ceramic not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Successfully retrieved the ceramic",
        data: ceramic,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}

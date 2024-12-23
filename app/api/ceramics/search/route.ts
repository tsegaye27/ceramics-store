import dbConnect from "@/app/_lib/mongoose";
import { Ceramic } from "@/app/_models/Ceramics";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    await dbConnect();

    let results;

    if (search) {
      results = await Ceramic.find({
        $or: [
          { code: { $regex: search, $options: "i" } },
          { size: { $regex: search, $options: "i" } },
          { type: { $regex: search, $options: "i" } },
          { manufacturer: { $regex: search, $options: "i" } },
        ],
      }).limit(100);
    } else {
      results = await Ceramic.find({}).limit(100);
    }

    return NextResponse.json(
      {
        message: search
          ? "Search completed successfully"
          : "Fetched all ceramics successfully",
        data: results,
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

import { Order } from "@/app/_models/Orders";
import logger from "@/app/_utils/logger";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/_lib/mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const orders = await Order.find().populate("ceramicId");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    logger.error(`${error}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

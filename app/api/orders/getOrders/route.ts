import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models/Orders";
import logger from "@/app/_utils/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const orders = await Order.find().populate([
      {
        path: "ceramicId",
        select: "size piecesPerPacket code name",
      },
      {
        path: "userId",
        select: "name",
      },
    ]);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    logger.error(`Error in GET /api/orders/getOrders: ${error}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

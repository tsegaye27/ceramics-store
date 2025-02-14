import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models/Orders";
import logger from "@/app/_utils/logger";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function GET(_req: NextRequest) {
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
    return successResponse(orders, "Orders fetched successfully");
  } catch (error) {
    logger.error(`Error in GET /api/orders/getOrders: ${error}`);
    return errorResponse("Internal server error", 500);
  }
}

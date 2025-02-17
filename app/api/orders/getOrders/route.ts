import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models/Orders";
import logger from "@/services/logger";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    let token = req.headers.get("authorization")?.split(" ")[1] || "";

    if (!token) {
      const cookieHeader = req.headers.get("cookie") || "";
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => c.split("=")),
      );
      token = cookies["jwt"];
    }

    if (!token) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

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

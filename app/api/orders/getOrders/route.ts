import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models";
import logger from "@/services/logger";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const tokenResult = decodeToken(req);

    if (!tokenResult?.decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!checkPermission(tokenResult?.decodedToken, "admin")) {
      return errorResponse("You don't have permission to get orders", 403);
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

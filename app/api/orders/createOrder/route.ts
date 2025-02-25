import dbConnect from "@/app/api/_lib/mongoose";
import logger from "@/services/logger";
import { Order } from "@/app/api/_models";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { orderSchema } from "@/app/_validators/orderSchema";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const createOrderData = await req.json();
    const validation = orderSchema.safeParse(createOrderData);
    const tokenResult = decodeToken(req);

    if (!tokenResult?.decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!checkPermission(tokenResult?.decodedToken, "admin")) {
      return errorResponse("You don't have permission to create order", 403);
    }

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { ceramicId, packets, pieces, price, seller } = createOrderData;

    const userId = tokenResult?.decodedToken?.id;

    const order = await Order.create({
      ceramicId,
      userId,
      packets,
      pieces,
      price,
      seller,
    });

    return successResponse({ order }, "Your order was successfully Created");
  } catch (error) {
    logger.error(`Error in POST /api/orders/createOrder: ${error}`);
    return errorResponse("Internal server error", 500);
  }
}

import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models/Orders";
import logger from "@/services/logger";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { orderSchema } from "../../_validators/orderSchema";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const createOrderData = await req.json();
    const validation = orderSchema.safeParse(createOrderData);
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
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { ceramicId, packets, pieces, price, seller } = createOrderData;

    const decoded = jwtDecode<{ id: string }>(token.split(" ")[1]);
    const userId = decoded.id;

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
    logger.error(`${error}`);
    return errorResponse("Internal server error", 500);
  }
}

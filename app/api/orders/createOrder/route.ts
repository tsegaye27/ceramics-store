import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models/Orders";
import logger from "@/app/_utils/logger";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.headers.get("Authorization");
    const { ceramicId, packets, pieces, price, seller } = await req.json();

    if (!ceramicId || !packets || !pieces || !price || !seller) {
      return errorResponse("All fields are required", 400);
    }

    if (!token) {
      return errorResponse("Unauthorized", 401);
    }

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

    return successResponse({order}, "Your order was successfully Created")  } catch (error) {
    logger.error(`${error}`);
    return errorResponse("Internal server error", 500);
  }
}

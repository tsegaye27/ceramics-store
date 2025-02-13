import dbConnect from "@/app/api/_lib/mongoose";
import { Order } from "@/app/api/_models/Orders";
import logger from "@/app/_utils/logger";
import { jwtDecode } from "jwt-decode";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.headers.get("Authorization");
    const { ceramicId, packets, pieces, price, seller } = await req.json();

    if (!ceramicId || !packets || !pieces || !price || !seller) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    logger.error(`${error}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

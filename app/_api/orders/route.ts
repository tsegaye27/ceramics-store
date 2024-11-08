import { NextResponse } from "next/server";
import dbConnect from "@/app/_lib/mongoose";
import Order from "@/app/_models/Order";
import jwt from "jsonwebtoken";
import Ceramics from "@/app/_models/Ceramics";
import User from "@/app/_models/User";

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.json();
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in token" },
        { status: 400 }
      );
    }

    const { ceramicId, seller, pieces, packets, price } = body;

    if (!ceramicId) {
      return NextResponse.json(
        { error: "Ceramic ID is required" },
        { status: 400 }
      );
    }
    if (!seller) {
      return NextResponse.json(
        { error: "Seller name is required" },
        { status: 400 }
      );
    }
    if (packets === undefined || packets === null) {
      return NextResponse.json(
        { error: "Number of packets is required" },
        { status: 400 }
      );
    }
    if (pieces === undefined || pieces === null) {
      return NextResponse.json(
        { error: "Number of pieces is required" },
        { status: 400 }
      );
    }
    if (price === undefined || price === null) {
      return NextResponse.json(
        { error: "The price is required" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      ceramicId,
      seller,
      userId,
      pieces,
      packets,
      price,
    });

    await newOrder.save();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const Orders = await Order.find().populate("userId").populate("ceramicId");

    return NextResponse.json(Orders);
  } catch (error) {
    console.error("Error fetching sell orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

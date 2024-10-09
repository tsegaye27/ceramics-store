import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import Ceramics, { ICeramics } from "@/app/models/Ceramics";

export async function GET(request: Request) {
  const client = await clientPromise;
  const db = client.db("ceramics");

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search") || "";

  const ceramics = await db
    .collection<ICeramics>("ceramics")
    .find({
      $or: [
        { size: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
        { manufacturer: { $regex: searchQuery, $options: "i" } },
        { code: { $regex: searchQuery, $options: "i" } },
      ],
    })
    .toArray();

  return NextResponse.json(ceramics);
}

export async function POST(request: Request) {
  const body = await request.json();
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(body);
    const newCeramic = new Ceramics(body);
    await newCeramic.save();
    return NextResponse.json(newCeramic, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}

export async function PATCH(request: Request) {
  const { id, ...updateData } = await request.json();

  try {
    const updatedCeramic = await Ceramics.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCeramic) {
      return NextResponse.json({ error: "Ceramic not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Updated successfully",
      data: updatedCeramic,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const deletedCeramic = await Ceramics.findByIdAndDelete(id);

    if (!deletedCeramic) {
      return NextResponse.json({ error: "Ceramic not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}

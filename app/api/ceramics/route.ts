import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
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

  if (
    !body.size ||
    !body.type ||
    !body.manufacturer ||
    !body.code ||
    !body.piecesPerPacket
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const newCeramic = new Ceramics(body);
  await newCeramic.save();
  return NextResponse.json(newCeramic, { status: 201 });
}

export async function PATCH(request: Request) {
  const { id, ...updateData } = await request.json();
  await Ceramics.findByIdAndUpdate(id, updateData);
  return NextResponse.json({ message: "Updated successfully" });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await Ceramics.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}

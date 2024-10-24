import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import jwt from "jsonwebtoken";
import Ceramics, { ICeramics } from "@/app/models/Ceramics";
import { Error } from "mongoose";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");
    const id = url.searchParams.get("id");

    let ceramics: ICeramics[] | ICeramics | null;

    if (id) {
      ceramics = await Ceramics.findById(id);
      if (!ceramics) {
        return NextResponse.json(
          { error: "Ceramic not found" },
          { status: 404 }
        );
      }
    } else if (searchQuery) {
      ceramics = await Ceramics.find({
        $or: [
          { size: { $regex: searchQuery, $options: "i" } },
          { type: { $regex: searchQuery, $options: "i" } },
          { manufacturer: { $regex: searchQuery, $options: "i" } },
          { code: { $regex: searchQuery, $options: "i" } },
        ],
      });
    } else {
      ceramics = await Ceramics.find({}).sort({
        totalPackets: 1,
        createdAt: -1,
      });
    }

    return NextResponse.json(ceramics);
  } catch (error) {
    console.error("Error fetching ceramics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: "Ceramic already exists" },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}

export async function PATCH(request: Request) {
  const { id, totalPackets, totalPiecesWithoutPacket, action } =
    await request.json();

  try {
    const ceramic = await Ceramics.findById(id);
    if (!ceramic) {
      return NextResponse.json({ error: "Ceramic not found" }, { status: 404 });
    }

    if (action === "sell") {
      if (ceramic.totalPackets < totalPackets) {
        return NextResponse.json(
          { error: "Insufficient inventory for sale" },
          { status: 400 }
        );
      }

      if (ceramic.totalPiecesWithoutPacket < totalPiecesWithoutPacket) {
        ceramic.totalPackets -= 1;
        ceramic.totalPiecesWithoutPacket += ceramic.piecesPerPacket;
      }

      ceramic.totalPackets -= totalPackets;
      ceramic.totalPiecesWithoutPacket -= totalPiecesWithoutPacket;

      ceramic.totalPackets = Math.max(0, ceramic.totalPackets);
      ceramic.totalPiecesWithoutPacket = Math.max(
        0,
        ceramic.totalPiecesWithoutPacket
      );

      // if (
      //   ceramic.totalPackets === 0 &&
      //   ceramic.totalPiecesWithoutPacket === 0
      // ) {
      //   await Ceramics.findByIdAndDelete(id);
      //   return NextResponse.json({
      //     message: "Ceramic sold and deleted successfully",
      //   });
      // }
    } else if (action === "add") {
      ceramic.totalPackets += totalPackets;
      if (
        ceramic.totalPiecesWithoutPacket + totalPiecesWithoutPacket >=
        ceramic.piecesPerPacket
      ) {
        ceramic.totalPackets += Math.floor(
          (ceramic.totalPiecesWithoutPacket + totalPiecesWithoutPacket) /
            ceramic.piecesPerPacket
        );
        ceramic.totalPiecesWithoutPacket =
          (ceramic.totalPiecesWithoutPacket + totalPiecesWithoutPacket) %
          ceramic.piecesPerPacket;
      } else {
        ceramic.totalPiecesWithoutPacket += totalPiecesWithoutPacket;
      }
    }

    const updatedCeramic = await ceramic.save();
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

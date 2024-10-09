import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import jwt from "jsonwebtoken";
import Ceramics, { ICeramics } from "@/app/models/Ceramics";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");
    const id = url.searchParams.get("id");

    let ceramics;

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
      ceramics = await Ceramics.find({});
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

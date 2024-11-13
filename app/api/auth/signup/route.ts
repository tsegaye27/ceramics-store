import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/_lib/mongoose";
import User from "@/app/_models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing name, email or password" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "Signup successful",
        user: { name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

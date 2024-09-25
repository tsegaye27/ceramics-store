import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ceramics");

    const user = await db.collection("users").findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      hashedPassword,
    };
    await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      { message: "Signup successful", user: { email: newUser.email } },
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

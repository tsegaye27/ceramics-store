import { NextResponse } from "next/server";
import { User } from "@/app/_models/Users";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/_lib/mongoose";

export async function POST(request: Request) {
  try {
    // Connect to the database before performing any operations
    await dbConnect();

    const { name, email, password } = await request.json();

    // Validate input fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ email }); // Use findOne to return a single document
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the correct field name
    const newUser = new User({
      name,
      email,
      hashedPassword, // Ensure you are using 'hashedPassword'
    });

    // Save the new user to the database
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

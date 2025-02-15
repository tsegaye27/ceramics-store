import { User } from "@/app/api/_models/Users";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/api/_lib/mongoose";
import logger from "@/services/logger";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return errorResponse("All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      hashedPassword,
      role,
    });

    await newUser.save();

    return successResponse({ newUser }, "User created successfully");
  } catch (error) {
    logger.error("Error during signup:", error);
    return errorResponse("Internal server error", 500);
  }
}

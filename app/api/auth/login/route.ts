import { User } from "@/app/api/_models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/api/_lib/mongoose";
import logger from "@/services/logger";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.TOKEN_EXPIRATION!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("All fields are required", 400);}

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Invalid email or password", 401);}

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return successResponse({ token }, "Login successful");
  } catch (error) {
    logger.error("Error during login:", error);
    return errorResponse("Internal server error", 500);
  }
}

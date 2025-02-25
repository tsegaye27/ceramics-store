import { User } from "@/app/api/_models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/api/_lib/mongoose";
import logger from "@/services/logger";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { loginSchema } from "@/app/_validators/userSchema";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.TOKEN_EXPIRATION!;

export async function POST(request: Request) {
  try {
    const loginData = await request.json();
    const validation = loginSchema.safeParse(loginData);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { email, password } = validation.data;

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION },
    );
    logger.info(`User ${user.email} logged in`);
    return successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "Login successful",
    );
  } catch (error) {
    logger.error("Error during login:", error);
    return errorResponse("Internal server error", 500);
  }
}

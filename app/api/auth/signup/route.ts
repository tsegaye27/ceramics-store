import { User } from "@/app/api/_models/Users";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/api/_lib/mongoose";
import logger from "@/services/logger";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { signupSchema } from "@/app/_validators/userSchema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.TOKEN_EXPIRATION!;

export async function POST(request: Request) {
  try {
    await dbConnect();

    const signupData = await request.json();
    const validation = signupSchema.safeParse(signupData);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { name, email, password, role } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION },
    );
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
      "Signed up successfully",
    );
  } catch (error) {
    logger.error("Error during signup:", error);
    return errorResponse("Internal server error", 500);
  }
}

import { sign } from "jsonwebtoken";
import dbConnect from "../../_lib/mongoose";
import { User } from "../../_models";
import { errorResponse, successResponse } from "@/app/_utils/apiResponse";

const SECRET_KEY = process.env.JWT_SECRET!;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION!;

export const POST = async (req: Request) => {
  const { userId } = await req.json();

  if (!userId) {
    return errorResponse("User ID is required", 400);
  }

  try {
    await dbConnect();
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const newToken = sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRATION,
      },
    );

    return successResponse({ token: newToken }, "Token refreshed successfully");
  } catch (error) {
    return errorResponse("Internal server error", 500);
  }
};

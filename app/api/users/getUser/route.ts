import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { User } from "@/app/api/_models/Users";
import { decodeToken } from "../../_utils/decodeToken";

export type DecodedToken = {
  id: string;
  role: string;
};

export async function GET(req: Request) {
  const tokenResult = decodeToken(req);

  if (!tokenResult?.decodedToken) {
    return errorResponse("Unauthorized: No token provided", 401);
  }
  try {
    const user = await User.findOne({ _id: tokenResult?.decodedToken?.id });
    if (!user) {
      return errorResponse("User not found", 404);
    }
    return successResponse(user, "User fetched successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

import { jwtDecode } from "jwt-decode";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { User } from "@/app/api/_models/Users";

type DecodedToken = {
  id: string;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse("Unauthorized", 401);
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwtDecode<DecodedToken>(token);

  try {
    const user = await User.findOne({ _id: decodedToken?.id });
    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user, "User fetched successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

import { jwtDecode } from "jwt-decode";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { User } from "@/app/api/_models/Users";

export type DecodedToken = {
  id: string;
  role: string;
};

export async function GET(req: Request) {
  let token = req.headers.get("authorization")?.split(" ")[1] || "";

  if (!token) {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("=")),
    );
    token = cookies["jwt"];
  }

  if (!token) {
    return errorResponse("Unauthorized: No token provided", 401);
  }
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

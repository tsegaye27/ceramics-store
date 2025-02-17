import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import logger from "@/services/logger";

export async function GET(req: Request) {
  try {
    await dbConnect();
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
    const ceramics = await Ceramic.find({}).limit(100);
    logger.info("Ceramics fetched successfully");
    return successResponse(ceramics, "Ceramics fetched successfully");
  } catch (error: any) {
    logger.error("Error fetching ceramics", error);
    return errorResponse(error.message, 500);
  }
}

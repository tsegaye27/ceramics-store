import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import logger from "@/services/logger";
import { decodeToken } from "../../_utils/decodeToken";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const tokenResult = decodeToken(req);
    if (!tokenResult?.decodedToken) {
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

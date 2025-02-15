import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import logger from "@/services/logger"

export async function GET() {
  try {
    await dbConnect();
    const ceramics = await Ceramic.find({}).limit(100);
    logger.info("Ceramics fetched successfully")
    return successResponse(ceramics, "Ceramics fetched successfully");
  } catch (error: any) {
    logger.error("Error fetching ceramics", error)
    return errorResponse(error.message, 500);
  }
}

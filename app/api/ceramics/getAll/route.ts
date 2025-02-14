import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function GET() {
  try {
    await dbConnect();
    const ceramics = await Ceramic.find({}).limit(100);
    return successResponse(ceramics, "Ceramics fetched successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

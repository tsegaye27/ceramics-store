import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { decodeToken } from "../../_utils/decodeToken";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const ceramicId = searchParams.get("ceramicId");
    const tokenResult = decodeToken(req);

    if (!tokenResult?.decodedToken) {
      return errorResponse("Unauthorized: No token provided", 401);
    }

    if (!ceramicId) {
      return errorResponse("Ceramic ID is required", 400);
    }

    await dbConnect();

    const ceramic = await Ceramic.findById(ceramicId);

    if (!ceramic) {
      return errorResponse("Ceramic not found", 404);
    }

    return successResponse(ceramic, "Ceramic fetched successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

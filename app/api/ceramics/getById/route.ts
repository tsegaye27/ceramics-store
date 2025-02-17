import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const ceramicId = searchParams.get("ceramicId");

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

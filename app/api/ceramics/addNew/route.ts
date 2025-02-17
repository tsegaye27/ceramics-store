import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { ICeramic } from "@/app/_types/types";
import { formatPieces } from "@/app/_utils/helperFunctions";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";
import { createCeramicSchema } from "../../_validators/ceramicSchema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DecodedToken } from "../../users/getUser/route";

export async function POST(req: NextRequest) {
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
    let decodedToken: JwtPayload | DecodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload &
        DecodedToken;
    } catch (err) {
      return errorResponse("Unauthorized: Invalid token", 401);
    }

    const userRole = decodedToken.role; // Ensure token includes 'role'
    if (userRole !== "admin") {
      return errorResponse("Forbidden: Admin access required", 403);
    }

    // Parse and validate request body
    const ceramicData: ICeramic = await req.json();
    const validation = createCeramicSchema.safeParse(ceramicData);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    // Format ceramic data
    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      validation.data;
    const { packets, pieces } = formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      piecesPerPacket,
    );

    // Save new ceramic entry
    const newCeramic = new Ceramic({
      ...ceramicData,
      totalPackets: packets,
      totalPiecesWithoutPacket: pieces,
    });

    const savedCeramic = await newCeramic.save();
    return successResponse(savedCeramic, "Ceramic created successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

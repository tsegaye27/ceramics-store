import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import dbConnect from "../../_lib/mongoose";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";
import { Ceramic } from "../../_models";
import logger from "@/services/logger";

export async function GET(req: Request) {
  const tokenResult = decodeToken(req);

  if (!tokenResult?.decodedToken) {
    return errorResponse("Unauthorized: No token provided", 401);
  }

  if (!checkPermission(tokenResult?.decodedToken, "admin")) {
    return errorResponse("You don't have permission to get orders", 403);
  }

  try {
    await dbConnect();

    const result = await Ceramic.aggregate([
      {
        $group: {
          _id: {
            size: "$size",
            type: "$type",
            manufacturer: "$manufacturer",
          },
          totalPackets: { $sum: "$totalPackets" },
          totalPiecesWithoutPacket: { $sum: "$totalPiecesWithoutPacket" },
          piecesPerPacket: { $first: "$piecesPerPacket" },
        },
      },
      {
        $project: {
          _id: 0,
          size: "$_id.size",
          type: "$_id.type",
          manufacturer: "$_id.manufacturer",
          totalArea: {
            $multiply: [
              {
                $add: [
                  { $multiply: ["$totalPackets", "$piecesPerPacket"] },
                  "$totalPiecesWithoutPacket",
                ],
              },
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id.size", "60x60"] }, then: 0.36 },
                    { case: { $eq: ["$_id.size", "40x40"] }, then: 0.16 },
                    { case: { $eq: ["$_id.size", "30x30"] }, then: 0.09 },
                    { case: { $eq: ["$_id.size", "30x60"] }, then: 0.18 },
                    { case: { $eq: ["$_id.size", "zekolo"] }, then: 0.6 },
                  ],
                  default: 0,
                },
              },
            ],
          },
        },
      },
    ]);

    return successResponse(result, "Analytics fetched successfully");
  } catch (err: any) {
    logger.error("Error calculating analytics: ", err);
    return errorResponse(`Failed to calculate analytics: ${err.message}`, 500);
  }
}

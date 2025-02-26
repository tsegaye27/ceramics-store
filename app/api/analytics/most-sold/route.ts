import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";
import dbConnect from "../../_lib/mongoose";
import { Order } from "../../_models";

export async function GET(req: Request) {
  const decodedToken = decodeToken(req);

  if (!decodedToken) {
    return errorResponse("Unauthorized: No token provided", 401);
  }

  if (!checkPermission(decodedToken, "admin")) {
    return errorResponse("You don't have permission to get orders", 403);
  }

  try {
    await dbConnect();
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const thisWeekStart = new Date(
      new Date().setDate(now.getDate() - now.getDay()),
    );
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const getMostSoldCeramic = async (startDate: Date) => {
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $lookup: {
            from: "ceramics",
            localField: "ceramicId",
            foreignField: "_id",
            as: "ceramic",
          },
        },
        {
          $unwind: "$ceramic",
        },
        {
          $group: {
            _id: "$ceramicId",
            totalQuantity: {
              $sum: {
                $add: [
                  { $multiply: ["$packets", "$ceramic.piecesPerPacket"] },
                  "$pieces",
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: "ceramics",
            localField: "_id",
            foreignField: "_id",
            as: "ceramic",
          },
        },
        {
          $unwind: "$ceramic",
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 1,
        },
        {
          $project: {
            _id: 0,
            ceramic: {
              size: "$ceramic.size",
              type: "$ceramic.type",
              manufacturer: "$ceramic.manufacturer",
            },
            totalQuantity: {
              $multiply: [
                "$totalQuantity",
                {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$ceramic.size", "60x60"] }, then: 0.36 },
                      { case: { $eq: ["$ceramic.size", "40x40"] }, then: 0.16 },
                      { case: { $eq: ["$ceramic.size", "30x30"] }, then: 0.09 },
                      { case: { $eq: ["$ceramic.size", "30x60"] }, then: 0.18 },
                      { case: { $eq: ["$ceramic.size", "zekolo"] }, then: 0.6 },
                    ],
                    default: 0,
                  },
                },
              ],
            },
          },
        },
      ]);
      return result[0] || null;
    };

    const mostSoldToday = await getMostSoldCeramic(todayStart);
    const mostSoldThisWeek = await getMostSoldCeramic(thisWeekStart);
    const mostSoldThisMonth = await getMostSoldCeramic(thisMonthStart);

    return successResponse(
      {
        today: mostSoldToday,
        thisWeek: mostSoldThisWeek,
        thisMonth: mostSoldThisMonth,
      },
      "Analytics fetched successfully",
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(`Internal server error: ${error.message}`, 500);
    } else {
      return errorResponse(
        "Internal server error: An unknown error occurred",
        500,
      );
    }
  }
}

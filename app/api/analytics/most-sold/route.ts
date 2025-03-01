import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";
import dbConnect from "../../_lib/mongoose";
import { Order } from "../../_models";
import { startOfToday, startOfWeek, startOfMonth } from "date-fns";
import logger from "@/services/logger";

export async function GET(req: Request) {
  const tokenResult = decodeToken(req);
  if (!tokenResult?.decodedToken)
    return errorResponse("Unauthorized: No token provided", 401);
  if (!checkPermission(tokenResult?.decodedToken, "admin"))
    return errorResponse("You don't have permission to get orders", 403);

  try {
    await dbConnect();
    const now = new Date();

    const dateRanges = {
      today: startOfToday(),
      thisWeek: startOfWeek(now, { weekStartsOn: 1 }),
      thisMonth: startOfMonth(now),
    };

    const getMostSold = async (startDate: Date, limit: number) => {
      return Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $lookup: {
            from: "ceramics",
            localField: "ceramicId",
            foreignField: "_id",
            as: "ceramic",
          },
        },
        { $unwind: "$ceramic" },
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
            ceramic: { $first: "$ceramic" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            ceramic: {
              size: 1,
              type: 1,
              manufacturer: 1,
              createdAt: 1,
            },
            totalQuantity: 1,
          },
        },
      ]);
    };

    const [today, thisWeek, thisMonth] = await Promise.all([
      getMostSold(dateRanges.today, 5),
      getMostSold(dateRanges.thisWeek, 1),
      getMostSold(dateRanges.thisMonth, 1),
    ]);
    return successResponse(
      {
        today,
        thisWeek,
        thisMonth,
      },
      "Analytics fetched",
    );
  } catch (error) {
    logger.error(error);
    return errorResponse("Internal server error", 500);
  }
}

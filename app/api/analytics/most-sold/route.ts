import { errorResponse, successResponse } from "@/app/_utils/apiResponse";
import { decodeToken } from "../../_utils/decodeToken";
import { checkPermission } from "../../_utils/checkPermission";
import dbConnect from "../../_lib/mongoose";
import { Order } from "../../_models";
import { startOfToday, endOfToday, subDays } from "date-fns";
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
      today: {
        start: startOfToday(),
        end: endOfToday(),
      },
      thisWeek: {
        start: subDays(now, 6),
        end: endOfToday(),
      },
      thisMonth: {
        start: subDays(now, 27),
        end: endOfToday(),
      },
    };

    const getMostSold = async (
      startDate: Date,
      endDate: Date,
      limit: number,
    ) => {
      return Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
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
              code: 1,
              manufacturer: 1,
              createdAt: 1,
            },
            totalQuantity: 1,
          },
        },
      ]);
    };

    const [today, thisWeek, thisMonth] = await Promise.all([
      getMostSold(dateRanges.today.start, dateRanges.today.end, 5),
      getMostSold(dateRanges.thisWeek.start, dateRanges.thisWeek.end, 1),
      getMostSold(dateRanges.thisMonth.start, dateRanges.thisMonth.end, 1),
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

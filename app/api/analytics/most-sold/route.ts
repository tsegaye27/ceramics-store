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
    return errorResponse(
      "Unauthorized: No token provided or token expired",
      401,
    );
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

    const getMostSoldProducts = async (
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
            createdAt: { $first: "$createdAt" },
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
            },
            totalQuantity: 1,
            createdAt: 1,
          },
        },
      ]);
    };

    const getTimeBasedSales = async (
      startDate: Date,
      endDate: Date,
      interval: "day" | "week",
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
          $addFields: {
            quantity: {
              $add: [
                { $multiply: ["$packets", "$ceramic.piecesPerPacket"] },
                "$pieces",
              ],
            },
            ceramicArea: {
              $switch: {
                branches: [
                  { case: { $eq: ["$ceramic.size", "60x60"] }, then: 0.36 },
                  { case: { $eq: ["$ceramic.size", "40x40"] }, then: 0.16 },
                  { case: { $eq: ["$ceramic.size", "30x60"] }, then: 0.18 },
                  { case: { $eq: ["$ceramic.size", "30x30"] }, then: 0.09 },
                  { case: { $eq: ["$ceramic.size", "zekolo"] }, then: 0.6 },
                ],
                default: 0,
              },
            },
          },
        },
        {
          $addFields: {
            orderArea: { $multiply: ["$quantity", "$ceramicArea"] },
          },
        },
        {
          $group: {
            _id: {
              date:
                interval === "day"
                  ? {
                      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    }
                  : { $isoWeek: "$createdAt" },
              ceramic: {
                size: "$ceramic.size",
                type: "$ceramic.type",
                code: "$ceramic.code",
                manufacturer: "$ceramic.manufacturer",
              },
            },
            totalQuantity: { $sum: "$quantity" },
            totalArea: { $sum: "$orderArea" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            totalQuantity: { $sum: "$totalQuantity" },
            ceramics: {
              $push: {
                size: "$_id.ceramic.size",
                type: "$_id.ceramic.type",
                code: "$_id.ceramic.code",
                manufacturer: "$_id.ceramic.manufacturer",
                totalQuantity: "$totalQuantity",
                totalArea: "$totalArea",
              },
            },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $addFields: {
            mostSoldCeramic: {
              $cond: {
                if: { $gt: [{ $size: "$ceramics" }, 0] },
                then: {
                  $let: {
                    vars: {
                      sortedCeramics: {
                        $sortArray: {
                          input: "$ceramics",
                          sortBy: { totalArea: -1 },
                        },
                      },
                    },
                    in: { $arrayElemAt: ["$$sortedCeramics", 0] },
                  },
                },
                else: null,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            mostSoldCeramic: 1,
            createdAt: 1,
            ...(interval === "week" && { weekNumber: "$_id" }),
          },
        },
      ]);
    };

    const [today, thisWeek, thisMonth] = await Promise.all([
      getMostSoldProducts(dateRanges.today.start, dateRanges.today.end, 5),
      getTimeBasedSales(
        dateRanges.thisWeek.start,
        dateRanges.thisWeek.end,
        "day",
      ),
      getTimeBasedSales(
        dateRanges.thisMonth.start,
        dateRanges.thisMonth.end,
        "week",
      ),
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

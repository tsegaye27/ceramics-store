import dbConnect from "@/app/api/_lib/mongoose";
import { Ceramic } from "@/app/api/_models/Ceramics";
import { successResponse, errorResponse } from "@/app/_utils/apiResponse";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    await dbConnect();

    let results;

    if (search) {
      results = await Ceramic.find({
        $or: [
          { code: { $regex: search, $options: "i" } },
          { size: { $regex: search, $options: "i" } },
          { type: { $regex: search, $options: "i" } },
          { manufacturer: { $regex: search, $options: "i" } },
        ],
      }).limit(100);
    } else {
      results = await Ceramic.find({}).limit(100);
    }

    return successResponse(results, `${results ? "Ceramics fetched successfully" : "No ceramics found"}`);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

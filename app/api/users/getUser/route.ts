import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}
import { User } from "@/app/_models/Users";
import logger from "@/app/_utils/logger";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Authorization header is missing or invalid" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwtDecode<DecodedToken>(token);
  logger.info("Decoded token", decodedToken);

  try {
    const user = await User.findOne({ _id: decodedToken?.id });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

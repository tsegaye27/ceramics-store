import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface UserPayload {
  name: string;
  email: string;
  role: "chis" | "user";
  hashedPassword: string;
  createdAt: Date;
}

export const authenticate = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;
    req.user = decoded;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
};

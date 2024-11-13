import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type UserPayload = {
  name: string;
  email: string;
  role: "chis" | "user";
  hashedPassword: string;
  createdAt: Date;
};

const withRole = (role: string) => {
  return async (req: NextRequest, res: NextApiResponse, next: Function) => {
    const user = req.user as UserPayload;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (user.role !== role) {
      res.status(403).json({ message: "Access Denied" });
      return;
    }
    next();
  };
};

export default withRole;

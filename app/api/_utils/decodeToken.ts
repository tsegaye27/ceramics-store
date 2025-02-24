// import logger from "@/services/logger";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  role?: string;
}

// Function to extract and decode the token
export const decodeToken = (req: Request): DecodedToken | null => {
  let token = req.headers.get("authorization")?.split(" ")[1] || "";

  if (!token) {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("=")),
    );
    token = cookies["jwt"];
  }

  if (!token) return null;

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as DecodedToken;
    /*     logger.info(JSON.stringify(decodedToken, null, 2)); */
    return decodedToken;
  } catch (err) {
    return null;
  }
};

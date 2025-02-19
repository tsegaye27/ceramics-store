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
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (err) {
    return null;
  }
};

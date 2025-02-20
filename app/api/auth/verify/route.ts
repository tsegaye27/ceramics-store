import { verify, JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export const GET = async (req: Request) => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is required" }), {
      status: 401,
    });
  }

  try {
    const decoded = verify(token, SECRET_KEY) as JwtPayload;

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return new Response(
        JSON.stringify({ valid: false, message: "Token expired" }),
        { status: 401 },
      );
    }

    return new Response(JSON.stringify({ valid: true, decoded }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, message: "Invalid token" }),
      { status: 401 },
    );
  }
};

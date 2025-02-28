import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "../api/_utils/decodeToken";

export function middleware(req: NextRequest) {
  const tokenResult = decodeToken(req);
  const user = tokenResult?.decodedToken;
  const { pathname } = req.nextUrl;

  if (
    ["/add", "/sell", "/orders"].some((prefix) =>
      pathname.startsWith(prefix),
    ) &&
    user?.role !== "admin"
  ) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add/:path*", "/sell/:path*", "/orders/:path*"],
};

import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  role?: string;
  name?: string;
  id?: string;
}

export const checkPermission = (
  decodedToken: DecodedToken,
  role: string,
): boolean => {
  return decodedToken.role === role;
};

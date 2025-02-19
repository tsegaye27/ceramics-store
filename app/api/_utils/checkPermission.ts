import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  role?: string;
}

// Function to check if the user has the required role
export const checkPermission = (
  decodedToken: DecodedToken,
  role: string,
): boolean => {
  return decodedToken.role === role;
};

import { sign as signJWT } from "jsonwebtoken";

// Types
import { JwtPayload } from "@/app/modules/auth/interfaces/jwt-payload.interface";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 86400;

export const generateJWT = (data: JwtPayload) => {
  const expiresIn = EXPIRES_IN;

  const token = signJWT(data as Object, SECRET, {
    expiresIn,
  });

  return { token, expiresIn };
};

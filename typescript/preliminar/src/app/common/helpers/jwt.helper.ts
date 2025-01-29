import { sign as signJWT } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 86400;

export const generateJWT = <T>(data: T) => {
  const expiresIn = EXPIRES_IN;

  const token = signJWT(data as Object, SECRET, {
    expiresIn,
  });

  return { token, expiresIn };
};

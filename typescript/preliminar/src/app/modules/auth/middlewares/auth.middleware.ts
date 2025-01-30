import { verify } from "jsonwebtoken";

// Types
import { JwtPayload } from "../interfaces/jwt-payload.interface";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// MESSAGES
import { MESSAGES } from "@/app/common/messages";

// Types
import {
  Request,
  Response,
  NextFunction,
} from "@/app/common/interfaces/http.interfaces";

const SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.headers["authorization"]) {
    const error = new UnauthorizedError();
    return res.status(error.statusCode).json(error.toJSON());
  }

  const [type, token] = req?.headers["authorization"]?.split(" ");

  if (!type || type !== "Bearer") {
    const error = new BadRequestError(
      MESSAGES.error.middleware.auth.BadRequest.Unformatted
    );
    return res.status(error.statusCode).json(error.toJSON());
  }

  if (!token) {
    const error = new BadRequestError(
      MESSAGES.error.middleware.auth.BadRequest.Unformatted
    );
    return res.status(error.statusCode).json(error.toJSON());
  }

  const result = verify(token, SECRET) as JwtPayload;

  req.auth = result;

  next();
};

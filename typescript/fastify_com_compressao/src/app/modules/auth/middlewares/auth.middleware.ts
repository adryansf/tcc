import { verify } from "jsonwebtoken";

// Types
import { JwtPayload } from "../interfaces/jwt-payload.interface";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// MESSAGES
import { MESSAGES } from "@/app/common/messages";

// Types
import { Request, Response } from "@/app/common/interfaces/http.interfaces";

const SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req: Request, res: Response) => {
  if (!req?.headers["authorization"]) {
    const error = new UnauthorizedError();
    return res.code(error.statusCode).send(error.toJSON());
  }

  const [type, token] = req?.headers["authorization"]?.split(" ");

  if (!type || type !== "Bearer") {
    const error = new BadRequestError(
      MESSAGES.error.middleware.auth.BadRequest.Unformatted
    );
    return res.code(error.statusCode).send(error.toJSON());
  }

  if (!token) {
    const error = new BadRequestError(
      MESSAGES.error.middleware.auth.BadRequest.Unformatted
    );
    return res.code(error.statusCode).send(error.toJSON());
  }

  try {
    const result = verify(token, SECRET) as JwtPayload;

    req.auth = result;
  } catch (err) {
    const error = new UnauthorizedError();
    return res.code(error.statusCode).send(error.toJSON());
  }
};

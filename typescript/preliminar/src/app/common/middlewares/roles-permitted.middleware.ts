// Errors
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// Types
import {
  Request,
  Response,
  NextFunction,
} from "@/app/common/interfaces/http.interfaces";
import { RoleEnum } from "../enums/role.enum";

export const rolesPermittedMiddleware = (...rolesPermitted: RoleEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.auth) {
      const error = new UnauthorizedError();
      return res.status(error.statusCode).json(error.toJSON());
    }

    if (!rolesPermitted.includes(req.auth.role)) {
      const error = new UnauthorizedError();
      return res.status(error.statusCode).json(error.toJSON());
    }

    next();
  };
};

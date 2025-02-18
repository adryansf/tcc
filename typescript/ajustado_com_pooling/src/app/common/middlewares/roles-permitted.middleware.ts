// Errors
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// Types
import { Request, Response } from "@/app/common/interfaces/http.interfaces";
import { RoleEnum } from "../enums/role.enum";

export const rolesPermittedMiddleware = (...rolesPermitted: RoleEnum[]) => {
  return async (req: Request, res: Response) => {
    if (!req?.auth) {
      const error = new UnauthorizedError();
      return res.code(error.statusCode).send(error.toJSON());
    }

    if (!rolesPermitted.includes(req.auth.role)) {
      const error = new UnauthorizedError();
      return res.code(error.statusCode).send(error.toJSON());
    }
  };
};

// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { AuthService } from "./auth.service";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { LoginAuthDto } from "./dtos/inputs/login-auth.dto";
import { LoginAuthClientsOutputDto } from "./dtos/outputs/login-auth-clients.dto";
import { LoginAuthManagersOutputDto } from "./dtos/outputs/login-auth-managers.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IAuthController {
  loginClients: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<LoginAuthClientsOutputDto | BaseError>>;
}

export class AuthController extends BaseController implements IAuthController {
  constructor(private _service: AuthService) {
    super();
  }

  async loginClients(req: Request, res: Response) {
    const body = req.body as LoginAuthDto;

    const validation = await validator(LoginAuthDto, body);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.loginClients(body);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const output = new LoginAuthClientsOutputDto(result.value);

    return this.sendSuccessResponse(res, output);
  }

  async loginManagers(req: Request, res: Response) {
    const body = req.body as LoginAuthDto;

    const validation = await validator(LoginAuthDto, body);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.loginManagers(body);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const output = new LoginAuthManagersOutputDto(result.value);

    return this.sendSuccessResponse(res, output);
  }
}

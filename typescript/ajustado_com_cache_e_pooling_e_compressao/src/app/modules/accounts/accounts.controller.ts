// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { AccountsService } from "./accounts.service";

// Entities
import { AccountEntity } from "./entities/account.entity";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { CreateAccountDto } from "./dtos/inputs/create-account.dto";
import { FindOneAccountDto } from "./dtos/inputs/findOne-account.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IAccountsController {
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<AccountEntity | BaseError>>;
  findOne: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<AccountEntity | BaseError>>;
}

export class AccountsController
  extends BaseController
  implements IAccountsController
{
  constructor(private _service: AccountsService) {
    super();
  }

  async findOne(req: Request, res: Response) {
    const params = req.params as FindOneAccountDto;

    const validation = await validator(FindOneAccountDto, params);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.findOne(
      params.id,
      req.auth.id,
      req.auth.role
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const account = new AccountEntity(result.value);

    return this.sendSuccessResponse<AccountEntity>(res, account);
  }

  async create(req: Request, res: Response) {
    const body = req.body as CreateAccountDto;

    const validation = await validator(CreateAccountDto, body);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.create(body, req.auth.id);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const account = new AccountEntity(result.value);

    return this.sendSuccessResponse<AccountEntity>(res, account);
  }
}

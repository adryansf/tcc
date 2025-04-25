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
import { FindAllAccountsOutputDto } from "./dtos/outputs/findAll-accounts.dto";
import { FindAllQueryAccountDto } from "./dtos/inputs/findAllQuery-account.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";
import { transformer } from "@/app/common/helpers/transform.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IAccountsController {
  findAll: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<FindAllAccountsOutputDto | BaseError>>;
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<void | BaseError>>;
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

  async findAll(req: Request, res: Response) {
    const query = req.query as FindAllQueryAccountDto;

    const validation = await validator(FindAllQueryAccountDto, query);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.findAll(query);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const accounts = new FindAllAccountsOutputDto(result.value);

    return this.sendSuccessResponse<FindAllAccountsOutputDto>(res, accounts);
  }

  async findOne(req: Request, res: Response) {
    const params = req.params as unknown as FindOneAccountDto;

    const validation = await validator(FindOneAccountDto, params);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const transformedParams = transformer(FindOneAccountDto, params);

    const result = await this._service.findOne(
      transformedParams.id,
      req.auth.id,
      req.auth.role
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const account = result.value;

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

    const transformedBody = transformer(CreateAccountDto, body);

    const result = await this._service.create(
      transformedBody,
      req.auth.id,
      req.auth
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    return this.sendSuccessWithoutBody(res, 201);
  }
}

// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { TransactionsService } from "./transactions.service";

// Entities
import { TransactionEntity } from "./entities/transaction.entity";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { CreateTransactionDto } from "./dtos/inputs/create-transaction.dto";
import { FindAllTransactionsDto } from "./dtos/inputs/findAll-transactions.dto";
import { FindAllTransactionsOutputDto } from "./dtos/outputs/findAll-transactions.dto";
import { ParamsTransactionsDto } from "./dtos/inputs/params-transactions.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface ITransactionsController {
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<TransactionEntity | BaseError>>;
  findAll: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<FindAllTransactionsOutputDto | BaseError>>;
}

export class TransactionsController
  extends BaseController
  implements ITransactionsController
{
  constructor(private _service: TransactionsService) {
    super();
  }

  async findAll(req: Request, res: Response) {
    const params = req.params;

    const validation = await validator(ParamsTransactionsDto, params);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.findAll(
      params.idOriginAccount,
      req.auth.id,
      req.auth.role
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const transactions = new FindAllTransactionsOutputDto(result.value);

    return this.sendSuccessResponse<FindAllTransactionsOutputDto>(
      res,
      transactions
    );
  }

  async create(req: Request, res: Response) {
    const params = req.params;
    const body = req.body as CreateTransactionDto;

    const validationParams = await validator(ParamsTransactionsDto, params);

    if (validationParams.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(
          MESSAGES.error.BadRequest,
          validationParams?.value.errors
        )
      );
    }

    if (!body.idContaDestino) {
      body.idContaDestino = params.idOriginAccount;
    }

    const validationBody = await validator(CreateTransactionDto, body);

    if (validationBody.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(
          MESSAGES.error.BadRequest,
          validationBody?.value.errors
        )
      );
    }

    const result = await this._service.create(
      body as Required<CreateTransactionDto>,
      params.idOriginAccount,
      req.auth.id
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const transaction = new TransactionEntity(result.value);

    return this.sendSuccessResponse<TransactionEntity>(res, transaction);
  }
}

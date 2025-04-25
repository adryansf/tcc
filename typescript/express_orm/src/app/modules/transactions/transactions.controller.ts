// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { TransactionsService } from "./transactions.service";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { CreateTransactionDto } from "./dtos/inputs/create-transaction.dto";
import { FindAllTransactionsOutputDto } from "./dtos/outputs/findAll-transactions.dto";
import { FindAllQueryTransactionsDto } from "./dtos/inputs/findAllQuery-transactions.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";
import { transformer } from "@/app/common/helpers/transform.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface ITransactionsController {
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<void | BaseError>>;
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
    const query = req.query as FindAllQueryTransactionsDto;

    const validation = await validator(FindAllQueryTransactionsDto, query);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const transformedQuery = transformer(FindAllQueryTransactionsDto, query);

    const result = await this._service.findAll(
      transformedQuery.idConta,
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
    const body = req.body as CreateTransactionDto;

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

    const transformedBody = transformer(CreateTransactionDto, body);

    const result = await this._service.create(
      transformedBody as Required<CreateTransactionDto>,
      req.auth.id
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    return this.sendSuccessWithoutBody(res, 201);
  }
}

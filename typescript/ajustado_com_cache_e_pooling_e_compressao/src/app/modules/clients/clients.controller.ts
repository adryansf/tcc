// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { ClientsService } from "./clients.service";

// Entities
import { ClientEntity } from "./entities/client.entity";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { FindOneClientDto } from "./dtos/inputs/findOne-client.dto";
import { CreateClientDto } from "./dtos/inputs/create-client.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IClientsController {
  findOne: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<ClientEntity | BaseError>>;
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<ClientEntity | BaseError>>;
}

export class ClientsController
  extends BaseController
  implements IClientsController
{
  constructor(private _service: ClientsService) {
    super();
  }

  async findOne(req: Request, res: Response) {
    const params = req.params as FindOneClientDto;

    const validation = await validator(FindOneClientDto, params);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.findOne(params.id);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const client = new ClientEntity(result.value);

    return this.sendSuccessResponse<ClientEntity>(res, client);
  }

  async create(req: Request, res: Response) {
    const body = req.body as CreateClientDto;

    const validation = await validator(CreateClientDto, body);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const result = await this._service.create(body);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const client = new ClientEntity(result.value);

    return this.sendSuccessResponse<ClientEntity>(res, client);
  }
}

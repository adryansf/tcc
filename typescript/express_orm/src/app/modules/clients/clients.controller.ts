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
import { FindByCPFClientDto } from "./dtos/inputs/findByCPF-client.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";
import { transformer } from "@/app/common/helpers/transform.helper";

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
  findByCPF: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<ClientEntity | BaseError>>;
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<void | BaseError>>;
}

export class ClientsController
  extends BaseController
  implements IClientsController
{
  constructor(private _service: ClientsService) {
    super();
  }

  async findByCPF(req: Request, res: Response) {
    const params = req.params as unknown as FindByCPFClientDto;

    const validation = await validator(FindByCPFClientDto, params);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const transformedParams = transformer(FindByCPFClientDto, params);

    const result = await this._service.findByCPF(transformedParams.cpf);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const client = result.value;

    return this.sendSuccessResponse<ClientEntity>(res, client);
  }

  async findOne(req: Request, res: Response) {
    const params = req.params as unknown as FindOneClientDto;

    const validation = await validator(FindOneClientDto, params);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const transformedParams = transformer(FindOneClientDto, params);

    const result = await this._service.findOne(transformedParams.id);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const client = result.value;

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

    const transformedBody = transformer(CreateClientDto, body);

    const result = await this._service.create(transformedBody);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    return this.sendSuccessWithoutBody(res, 201);
  }
}

// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { AdminService } from "./admin.service";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { FindAllQueryAdminDto } from "./dtos/inputs/findAllQuery-admin.dto";
import { FindAllManagersAdminOutputDto } from "./dtos/outputs/findAllManagers-admin.dto";
import { FindAllClientsAdminOutputDto } from "./dtos/outputs/findAllClients-admin.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";
import { transformer } from "@/app/common/helpers/transform.helper";
// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IAdminController {
  findAllManagers: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<FindAllManagersAdminOutputDto | BaseError>>;
  findAllClients: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<FindAllClientsAdminOutputDto | BaseError>>;
}

export class AdminController
  extends BaseController
  implements IAdminController
{
  constructor(private _service: AdminService) {
    super();
  }

  async findAllManagers(req: Request, res: Response) {
    const query = req.query as unknown as FindAllQueryAdminDto;

    const validation = await validator(FindAllQueryAdminDto, query);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const transformedQuery = transformer(FindAllQueryAdminDto, query);

    const result = await this._service.findAllManagers(transformedQuery);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const response = new FindAllManagersAdminOutputDto(result.value);

    return this.sendSuccessResponse(res, response);
  }

  async findAllClients(req: Request, res: Response) {
    const query = req.query as unknown as FindAllQueryAdminDto;

    const validation = await validator(FindAllQueryAdminDto, query);

    if (validation.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(MESSAGES.error.BadRequest, validation?.value.errors)
      );
    }

    const transformedQuery = transformer(FindAllQueryAdminDto, query);

    const result = await this._service.findAllClients(transformedQuery);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const response = new FindAllClientsAdminOutputDto(result.value);

    return this.sendSuccessResponse(res, response);
  }
}

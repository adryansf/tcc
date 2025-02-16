// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { AddressesService } from "./addresses.service";

// Entities
import { AddressEntity } from "./entities/address.entity";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { CreateAddressDto } from "./dtos/inputs/create-address.dto";
import { ParamsAddressDto } from "./dtos/inputs/params-address.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IAddressController {
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<AddressEntity | BaseError>>;
  findOne: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<AddressEntity | BaseError>>;
}

export class AddressController
  extends BaseController
  implements IAddressController
{
  constructor(private _service: AddressesService) {
    super();
  }

  async findOne(req: Request, res: Response) {
    const params = req.params as ParamsAddressDto;

    const validationParams = await validator(ParamsAddressDto, params);

    if (validationParams.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(
          MESSAGES.error.BadRequest,
          validationParams?.value.errors
        )
      );
    }

    const result = await this._service.findOne(
      params.idClient,
      req.auth.id,
      req.auth.role
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const address = new AddressEntity(result.value);

    return this.sendSuccessResponse(res, address);
  }

  async create(req: Request, res: Response) {
    const params = req.params as ParamsAddressDto;
    const body = req.body as CreateAddressDto;

    const validationParams = await validator(ParamsAddressDto, params);

    if (validationParams.isLeft()) {
      return this.sendErrorResponse(
        res,
        new BadRequestError(
          MESSAGES.error.BadRequest,
          validationParams?.value.errors
        )
      );
    }

    const validationBody = await validator(CreateAddressDto, body);

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
      body,
      params.idClient,
      req.auth.id
    );

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const address = new AddressEntity(result.value);

    return this.sendSuccessResponse(res, address);
  }
}

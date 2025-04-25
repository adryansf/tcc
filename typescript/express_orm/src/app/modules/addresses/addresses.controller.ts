// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { AddressesService } from "./addresses.service";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

// Dtos
import { CreateAddressDto } from "./dtos/inputs/create-address.dto";

// Helpers
import { validator } from "@/app/common/helpers/validator.helper";
import { transformer } from "@/app/common/helpers/transform.helper";
// Messages
import { MESSAGES } from "@/app/common/messages";

// Errors
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { BaseError } from "@/app/common/errors/base.error";

export interface IAddressController {
  create: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<void | BaseError>>;
}

export class AddressController
  extends BaseController
  implements IAddressController
{
  constructor(private _service: AddressesService) {
    super();
  }

  async create(req: Request, res: Response) {
    const body = req.body as CreateAddressDto;

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

    const transformedBody = transformer(CreateAddressDto, body);

    const result = await this._service.create(transformedBody, req.auth.id);

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    return this.sendSuccessWithoutBody(res, 201);
  }
}

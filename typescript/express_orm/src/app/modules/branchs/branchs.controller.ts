// Interfaces
import {
  Request,
  Response,
  ReturnRoute,
} from "@/app/common/interfaces/http.interfaces";

// Service
import { BranchsService } from "./branchs.service";

// CommonClasses
import { BaseController } from "@/app/common/classes/base-controller.class";

import { BaseError } from "@/app/common/errors/base.error";
import { FindAllBranchsOutputDto } from "./dtos/outputs/findAll-branchs.dto";

export interface IBranchsController {
  findAll: (
    req: Request,
    res: Response
  ) => Promise<ReturnRoute<FindAllBranchsOutputDto | BaseError>>;
}

export class BranchsController
  extends BaseController
  implements IBranchsController
{
  constructor(private _service: BranchsService) {
    super();
  }

  async findAll(req: Request, res: Response) {
    const result = await this._service.findAll();

    if (result.isLeft()) {
      return this.sendErrorResponse(res, result.value);
    }

    const branchs = new FindAllBranchsOutputDto(result.value);

    return this.sendSuccessResponse<FindAllBranchsOutputDto>(res, branchs);
  }
}

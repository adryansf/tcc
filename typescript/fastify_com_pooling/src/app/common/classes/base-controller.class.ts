import { ReturnRoute, Response } from "../interfaces/http.interfaces";
import { BaseError } from "../errors/base.error";

interface Serializable {
  toJSON: () => Record<string, any>;
}

export class BaseController {
  protected sendErrorResponse(
    res: Response,
    error: BaseError
  ): ReturnRoute<BaseError> {
    return res.code(error.statusCode).send(error.toJSON());
  }

  protected sendSuccessWithoutBody(
    res: Response,
    status: number
  ): ReturnRoute<void> {
    return res.code(status).send();
  }

  protected sendSuccessResponse<T extends Serializable>(
    res: Response,
    data: T
  ): ReturnRoute<T> {
    return res.code(200).send(data.toJSON());
  }
}

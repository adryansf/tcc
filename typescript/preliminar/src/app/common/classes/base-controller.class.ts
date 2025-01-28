import { Response } from "express";
import { BaseError } from "../errors/base.error";

export class BaseController {
  protected sendErrorResponse(res: Response, error: BaseError) {
    return res.status(error.statusCode).json(error.toJSON());
  }

  protected sendSuccessResponse<T>(res: Response, data: T) {
    return res.status(200).json(data);
  }
}

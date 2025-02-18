import { BaseError } from "./base.error";

import { MESSAGES } from "../messages";

export class BadRequestError extends BaseError {
  constructor(message: string = MESSAGES.error.BadRequest, errors?: string) {
    super(message, 400, errors);
  }
}

import { BaseError } from "./base.error";

import { MESSAGES } from "../messages";

export class InternalServerError extends BaseError {
  constructor(
    message: string = MESSAGES.error.InternalServer,
    errors?: string
  ) {
    super(message, 500, errors);
  }
}

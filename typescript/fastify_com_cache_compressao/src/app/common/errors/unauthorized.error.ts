import { BaseError } from "./base.error";

import { MESSAGES } from "../messages";

export class UnauthorizedError extends BaseError {
  constructor(message: string = MESSAGES.error.Unauthorized, errors?: string) {
    super(message, 401, errors);
  }
}

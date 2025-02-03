import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
  constructor(message: string, errors?: string) {
    super(message, 404, errors);
  }
}

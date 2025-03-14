import { HttpResponseError } from "../interfaces/http.interfaces";

export class BaseError {
  protected _message: string;
  protected _statusCode: number = 500;
  protected _errors?: string;

  constructor(message: string, statusCode: number, errors?: string) {
    this._message = message;
    this._statusCode = statusCode;
    this._errors = errors;
  }

  get message() {
    return this._message;
  }

  get statusCode() {
    return this._statusCode;
  }

  get errors() {
    return this._errors;
  }

  toJSON(): HttpResponseError {
    return {
      statusCode: this._statusCode,
      message: this._message,
      errors: this?._errors,
    };
  }
}

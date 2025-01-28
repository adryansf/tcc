import {
  NextFunction as NextFunctionExpress,
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";

export interface HttpResponseSuccess<Data> {
  statusCode: number;
  data: Data;
}

export interface HttpResponseError {
  statusCode: number;
  message: string;
  errors?: string;
}

export type HttpResponse<Data> = HttpResponseSuccess<Data> | HttpResponseError;

export interface NextFunction extends NextFunctionExpress {}

export interface Request extends RequestExpress {}

export interface Response extends ResponseExpress {}

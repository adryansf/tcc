import {
  ErrorRequestHandler,
  RequestHandler,
  RequestParamHandler,
} from "express";

export type HttpHandler = ErrorRequestHandler | RequestHandler;

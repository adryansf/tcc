import { ErrorRequestHandler, RequestHandler } from "express";

export type HttpHandler = ErrorRequestHandler | RequestHandler;

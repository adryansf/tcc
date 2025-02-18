import { FastifyRequest, FastifyReply } from "fastify";
import { JwtPayload } from "@/app/modules/auth/interfaces/jwt-payload.interface";

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

// Não é necessário NextFunction no Fastify, pois ele usa reply.send()
export interface Request extends FastifyRequest {
  auth?: JwtPayload;
}

export interface Response extends FastifyReply {}

export type ReturnRoute<T> = FastifyReply & { data?: T };

import { FastifyRequest, FastifyReply, FastifyError } from "fastify";

export type HttpHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => void | Promise<void>;
export type ErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => void | Promise<void>;

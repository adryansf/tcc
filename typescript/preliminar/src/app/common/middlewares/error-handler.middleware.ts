import { BaseError } from "../common/errors/base.error";
import {
  Request,
  Response,
  NextFunction,
} from "@/app/common/interfaces/http.interfaces";

// Middleware de tratamento de erros
export function errorHandler(
  err: Error | BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Verifica se é uma instância de AppError
  const statusCode = err instanceof BaseError ? err.statusCode : 500;
  const message = err.message || "Erro interno do servidor";

  // Loga o erro (útil para debugging)
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  // Retorna a resposta do erro
  res.status(statusCode).json({
    statusCode,
    message,
  });
}

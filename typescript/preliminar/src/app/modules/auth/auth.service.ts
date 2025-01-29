// Dtos
import { LoginAuthDto } from "./dtos/inputs/login-auth.dto";
import { LoginAuthClientsOutputDto } from "./dtos/outputs/login-auth-clients.dto";

// Helpers
import { isPasswordCorrect } from "@/app/common/helpers/bcrypt.helper";
import { generateJWT } from "@/app/common/helpers/jwt.helper";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { NotFoundError } from "@/app/common/errors/not-found.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Types
import { Repositories } from "./auth.module";

interface IAuthService {
  loginClients: (
    data: LoginAuthDto
  ) => Promise<Either<BaseError, Omit<LoginAuthClientsOutputDto, "toJSON">>>;
}

export class AuthService implements IAuthService {
  constructor(private _repositories: Repositories) {}

  async loginClients(
    data: LoginAuthDto
  ): Promise<Either<BaseError, Omit<LoginAuthClientsOutputDto, "toJSON">>> {
    const client = await this._repositories.clients.findByEmail(data.email);
    if (!client) {
      return left(new BadRequestError(MESSAGES.error.auth.BadRequest));
    }

    if (!isPasswordCorrect(data.senha, client.senha)) {
      return left(new BadRequestError(MESSAGES.error.auth.BadRequest));
    }

    // Gerar token e retornar
    const { token, expiresIn } = generateJWT(client);

    return right({
      token,
      client,
      expiresIn,
    });
  }
}

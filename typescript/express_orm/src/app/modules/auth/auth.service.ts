// Dtos
import { LoginAuthDto } from "./dtos/inputs/login-auth.dto";
import { LoginAuthClientsOutputDto } from "./dtos/outputs/login-auth-clients.dto";
import { LoginAuthManagersOutputDto } from "./dtos/outputs/login-auth-managers.dto";

// Helpers
import { isPasswordCorrect } from "@/app/common/helpers/bcrypt.helper";
import { generateJWT } from "@/app/common/helpers/jwt.helper";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Types
import { Repositories } from "./auth.module";
import { RoleEnum } from "@/common/enums/role.enum";

interface IAuthService {
  loginClients: (
    data: LoginAuthDto
  ) => Promise<Either<BaseError, Omit<LoginAuthClientsOutputDto, "toJSON">>>;
  loginManagers: (
    data: LoginAuthDto
  ) => Promise<Either<BaseError, Omit<LoginAuthManagersOutputDto, "toJSON">>>;
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

    delete client["senha"];

    // Gerar token e retornar
    const { token, expiresIn } = generateJWT({
      email: client.email,
      id: client.id,
      role: RoleEnum.CLIENT,
      cpf: client.cpf,
    });

    return right({
      token,
      usuario: client,
      expiraEm: expiresIn.toISOString(),
    });
  }

  async loginManagers(
    data: LoginAuthDto
  ): Promise<Either<BaseError, Omit<LoginAuthManagersOutputDto, "toJSON">>> {
    const manager = await this._repositories.managers.findByEmail(data.email);
    if (!manager) {
      return left(new BadRequestError(MESSAGES.error.auth.BadRequest));
    }

    if (!isPasswordCorrect(data.senha, manager.senha)) {
      return left(new BadRequestError(MESSAGES.error.auth.BadRequest));
    }

    delete manager["senha"];

    // Gerar token e retornar
    const { token, expiresIn } = generateJWT({
      email: manager.email,
      id: manager.id,
      role: RoleEnum.MANAGER,
      cpf: manager.cpf,
    });

    return right({
      token,
      usuario: manager,
      expiraEm: expiresIn.toISOString(),
    });
  }
}

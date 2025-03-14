// Helpers
import { hasPermission } from "@/app/common/helpers/permission.helper";

// Entities
import { AccountEntity } from "./entities/account.entity";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { NotFoundError } from "@/app/common/errors/not-found.error";
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Dtos
import { CreateAccountDto } from "./dtos/inputs/create-account.dto";
import { FindAllQueryAccountDto } from "./dtos/inputs/findAllQuery-account.dto";
// Types
import { Repositories } from "./accounts.module";
import { RoleEnum } from "@/common/enums/role.enum";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interface";

interface IAccountsService {
  findAll: (
    query: FindAllQueryAccountDto,
    role: RoleEnum
  ) => Promise<Either<BaseError, Partial<AccountEntity>[]>>;
  create: (
    data: CreateAccountDto,
    idClient: string,
    auth: JwtPayload
  ) => Promise<Either<BaseError, AccountEntity>>;
  findOne: (
    id: string,
    idClient: string,
    role: RoleEnum
  ) => Promise<Either<BaseError, AccountEntity>>;
  delete: (
    id: string,
    idClient: string,
    role: RoleEnum
  ) => Promise<Either<BaseError, null>>;
}

export class AccountsService implements IAccountsService {
  constructor(private _repositories: Repositories) {}

  async findAll(
    query: FindAllQueryAccountDto
  ): Promise<Either<BaseError, Partial<AccountEntity>[]>> {
    const accounts = await this._repositories.accounts.findAll({
      cpf: query.cpf,
    });

    return right(accounts);
  }

  async create(
    data: CreateAccountDto,
    idClient: string,
    { email, role }: JwtPayload
  ): Promise<Either<BaseError, AccountEntity>> {
    if (role === RoleEnum.MANAGER) {
      const manager = await this._repositories.managers.findByEmail(email);
      data.idAgencia = manager.idAgencia;
    }

    if (!data.idAgencia) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.BranchRequired)
      );
    }

    const branch = await this._repositories.branchs.findById(data.idAgencia);

    if (!branch) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.BranchNotExists)
      );
    }

    if (role === RoleEnum.MANAGER) {
      if (!data.idCliente) {
        return left(
          new BadRequestError(MESSAGES.error.account.BadRequest.IdClient)
        );
      }

      var client = await this._repositories.clients.findById(data.idCliente);

      if (!client) {
        return left(new BadRequestError(MESSAGES.error.client.NotFound));
      }

      idClient = client.id;
    }

    const newAccount = await this._repositories.accounts.create({
      idAgencia: data.idAgencia,
      tipo: data.tipo,
      idCliente: idClient,
    });

    return right(newAccount);
  }

  async findOne(
    id: string,
    idClient: string,
    role: RoleEnum
  ): Promise<Either<BaseError, AccountEntity>> {
    const permission = hasPermission(role, RoleEnum.MANAGER);

    const account = await this._repositories.accounts.findById(id, true);

    if (!account) {
      return left(new NotFoundError(MESSAGES.error.account.NotFound));
    }

    if (account.idCliente !== idClient && !permission) {
      return left(new UnauthorizedError());
    }

    delete account.idCliente;
    delete account.idAgencia;

    return right(account);
  }

  async delete(
    id: string,
    idClient: string,
    role: RoleEnum
  ): Promise<Either<BaseError, null>> {
    const permission = hasPermission(role, RoleEnum.MANAGER);

    const account = await this._repositories.accounts.findById(id, true);

    if (!account) {
      return left(new NotFoundError(MESSAGES.error.account.NotFound));
    }

    if (account.idCliente !== idClient && !permission) {
      return left(new UnauthorizedError());
    }

    await this._repositories.accounts.delete(id);

    return right(null);
  }
}

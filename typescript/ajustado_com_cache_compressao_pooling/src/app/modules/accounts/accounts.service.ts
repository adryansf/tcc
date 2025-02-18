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
import { CacheService } from "@/app/common/cache/cache.service";
import { JwtPayload } from "jsonwebtoken";

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
}

export class AccountsService implements IAccountsService {
  constructor(
    private _repositories: Repositories,
    private _cacheService: CacheService
  ) {}

  async findAll(
    query: FindAllQueryAccountDto
  ): Promise<Either<BaseError, Partial<AccountEntity>[]>> {
    const cacheKey = `accounts:all:${query.cpf}`;
    const cachedAccounts = await this._cacheService.get<
      Partial<AccountEntity>[]
    >(cacheKey);

    if (cachedAccounts) {
      return right(cachedAccounts);
    }

    const accounts = await this._repositories.accounts.findAll({
      cpf: query.cpf,
    });

    await this._cacheService.set(cacheKey, accounts);

    return right(accounts);
  }

  async create(
    data: CreateAccountDto,
    idClient: string,
    { role, email, cpf }: JwtPayload
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
      cpf = client.cpf;
    }

    const newAccount = await this._repositories.accounts.create({
      idAgencia: data.idAgencia,
      tipo: data.tipo,
      idCliente: idClient,
    });

    await this._cacheService.reset(`accounts:all:${cpf}`);

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

    return right(account);
  }
}

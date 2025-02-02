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

// Types
import { Repositories } from "./accounts.module";
import { RoleEnum } from "@/common/enums/role.enum";

interface IAccountsService {
  create: (
    data: CreateAccountDto,
    idClient: string
  ) => Promise<Either<BaseError, AccountEntity>>;
  findOne: (
    id: string,
    idClient: string,
    role: RoleEnum
  ) => Promise<Either<BaseError, AccountEntity>>;
}

export class AccountsService implements IAccountsService {
  constructor(private _repositories: Repositories) {}

  async create(
    data: CreateAccountDto,
    idClient: string
  ): Promise<Either<BaseError, AccountEntity>> {
    const branch = await this._repositories.branchs.findById(data.idAgencia);

    if (!branch) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.BranchNotExists)
      );
    }

    const newAccount = await this._repositories.accounts.create({
      ...data,
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

    return right(account);
  }
}

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
import { InternalServerError } from "@/app/common/errors/internal-server.error";
import { ManagerEntity } from "../managers/entities/manager.entity";
import { BranchEntity } from "../branchs/entities/branch.entity";
import { ClientEntity } from "../clients/entities/client.entity";
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
      const cacheKey = `manager:email:${email}`;

      let manager = await this._cacheService.get<Partial<ManagerEntity>>(
        cacheKey
      );

      if (!manager) {
        manager = await this._repositories.managers.findByEmail(email);
        await this._cacheService.set(cacheKey, manager);
      }

      data.idAgencia = manager.idAgencia;
    }

    if (!data.idAgencia) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.BranchRequired)
      );
    }

    // Cache Branch
    const cacheKeyBranch = `branch:id:${data.idAgencia}`;

    let branch = await this._cacheService.get<Partial<BranchEntity>>(
      cacheKeyBranch
    );

    // Buscar no banco e Colocar em cache se não estiver
    if (!branch) {
      branch = await this._repositories.branchs.findById(data.idAgencia);
      await this._cacheService.set(cacheKeyBranch, branch);
    }

    // Verificar se a branch existe
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

      // Buscar Cliente no cache
      const cacheKeyClient = `client:id:${data.idCliente}`;

      var client = await this._cacheService.get<Partial<ClientEntity>>(
        cacheKeyClient
      );

      // Buscar no banco e Colocar em cache se não estiver
      if (!client) {
        client = await this._repositories.clients.findById(data.idCliente);
        await this._cacheService.set(cacheKeyClient, client);
      }

      // Verificar se o cliente existe
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

    if (newAccount === null) {
      return left(new InternalServerError(MESSAGES.error.InternalServer));
    }

    await this._cacheService.reset(`accounts:all:${cpf}`);
    await this._cacheService.set(`account:id:${newAccount.id}`, newAccount);

    return right(newAccount);
  }

  async findOne(
    id: string,
    idClient: string,
    role: RoleEnum
  ): Promise<Either<BaseError, AccountEntity>> {
    const permission = hasPermission(role, RoleEnum.MANAGER);

    const cacheKey = `account:id:${id}`;

    // Buscar no cache
    let account = await this._cacheService.get<AccountEntity>(
      cacheKey
    ); 

    // Buscar no banco e Colocar em cache se não estiver
    if (!account) {
      account = await this._repositories.accounts.findById(id);
      await this._cacheService.set(cacheKey, account);
    }

    // Verificar se a conta existe
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
}

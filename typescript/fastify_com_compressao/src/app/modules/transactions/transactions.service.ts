// Helpers
import { hasPermission } from "@/app/common/helpers/permission.helper";

// Database
import { db } from "@/database";

// Entities
import { TransactionEntity } from "./entities/transaction.entity";
import { AccountEntity } from "../accounts/entities/account.entity";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { NotFoundError } from "@/app/common/errors/not-found.error";
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";
import { InternalServerError } from "@/app/common/errors/internal-server.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Dtos
import { CreateTransactionDto } from "./dtos/inputs/create-transaction.dto";

// Types
import { Repositories } from "./transactions.module";
import { RoleEnum } from "@/common/enums/role.enum";
import { TransactionTypeEnum } from "./enums/transaction-type.enum";

interface ITransactionsService {
  create: (
    data: CreateTransactionDto,
    idClient: string
  ) => Promise<Either<BaseError, TransactionEntity>>;
  findAll: (
    id: string,
    idClient: string,
    role: RoleEnum
  ) => Promise<Either<BaseError, TransactionEntity[]>>;
}

export class TransactionsService implements ITransactionsService {
  constructor(private _repositories: Repositories) {}

  async create(
    data: Required<CreateTransactionDto>,
    idClient: string
  ): Promise<Either<BaseError, TransactionEntity>> {
    const { tipo } = data;

    let originAccount: AccountEntity | undefined = undefined;

    if (data.idContaDestino === data.idContaOrigem) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.SameAccount)
      );
    }

    // Verificar se contas existem
    if (data.idContaOrigem) {
      originAccount = await this._repositories.accounts.findById(
        data.idContaOrigem
      );

      if (!originAccount) {
        return left(new NotFoundError(MESSAGES.error.account.NotFoundOrigin));
      }

      if (originAccount.idCliente !== idClient) {
        return left(new UnauthorizedError());
      }
    }

    if (data.idContaDestino) {
      const targetAccount = await this._repositories.accounts.findById(
        data.idContaDestino
      );

      if (!targetAccount) {
        return left(new NotFoundError(MESSAGES.error.account.NotFoundTarget));
      }
    }

    // Verificar o saldo da conta
    if (
      (tipo === TransactionTypeEnum.TRANSFER ||
        tipo === TransactionTypeEnum.WITHDRAWAL) &&
      originAccount.saldo < data.valor
    ) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.BalanceNotEnough)
      );
    }

    const trx = await db.transaction();
    try {
      // Alterar os saldos das contas
      switch (tipo) {
        case TransactionTypeEnum.DEPOSIT:
          await this._repositories.accounts.addBalance(
            data.idContaDestino,
            data.valor,
            trx
          );
          break;
        case TransactionTypeEnum.TRANSFER:
          await this._repositories.accounts.removeBalance(
            data.idContaOrigem,
            data.valor,
            trx
          );
          await this._repositories.accounts.addBalance(
            data.idContaDestino,
            data.valor,
            trx
          );
          break;
        case TransactionTypeEnum.WITHDRAWAL:
          await this._repositories.accounts.removeBalance(
            data.idContaOrigem,
            data.valor,
            trx
          );
          break;
      }

      // Criar a transação
      const newTransaction = await this._repositories.transactions.create(
        data,
        trx
      );

      await trx.commit();

      return right(newTransaction);
    } catch (error) {
      await trx.rollback();
      return left(new InternalServerError());
    }
  }

  async findAll(
    idAccount: string,
    idClient: string,
    role: RoleEnum
  ): Promise<Either<BaseError, TransactionEntity[]>> {
    const permission = hasPermission(role, RoleEnum.MANAGER);

    const account = await this._repositories.accounts.findById(idAccount);

    if (!account) {
      return left(new NotFoundError(MESSAGES.error.account.NotFound));
    }

    if (account.idCliente !== idClient && !permission) {
      return left(new UnauthorizedError());
    }

    const transactions = await this._repositories.transactions.findAll(
      idAccount
    );

    return right(transactions);
  }
}

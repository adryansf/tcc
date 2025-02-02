// Helpers
import { hasPermission } from "@/app/common/helpers/permission.helper";

// Entities
import { TransactionEntity } from "./entities/transaction.entity";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { NotFoundError } from "@/app/common/errors/not-found.error";
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Dtos
import { CreateTransactionDto } from "./dtos/inputs/create-transaction.dto";

// Types
import { Repositories } from "./transactions.module";
import { RoleEnum } from "@/common/enums/role.enum";
import { TransactionTypeEnum } from "./enums/transaction-type.enum";
import {
  endDatabaseTransaction,
  startDatabaseTransaction,
} from "@/database/transactions";

interface ITransactionsService {
  create: (
    data: CreateTransactionDto,
    idOriginAccount: string,
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
    idOriginAccount: string,
    idClient: string
  ): Promise<Either<BaseError, TransactionEntity>> {
    // Verificar se contas existem
    const originAccount = await this._repositories.accounts.findById(
      idOriginAccount
    );

    if (!originAccount) {
      return left(new NotFoundError(MESSAGES.error.account.NotFoundOrigin));
    }

    if (originAccount.idCliente !== idClient) {
      return left(new UnauthorizedError());
    }

    const targetAccount = await this._repositories.accounts.findById(
      data.idContaDestino
    );

    if (!targetAccount) {
      return left(new NotFoundError(MESSAGES.error.account.NotFoundTarget));
    }

    // Verificar o saldo da conta
    if (
      (data.tipo === TransactionTypeEnum.TRANSFER ||
        data.tipo === TransactionTypeEnum.WITHDRAWAL) &&
      originAccount.saldo < data.valor
    ) {
      return left(
        new BadRequestError(MESSAGES.error.account.BadRequest.BalanceNotEnough)
      );
    }

    await startDatabaseTransaction();

    const newTransaction = await this._repositories.transactions.create({
      ...data,
      idContaOrigem: idOriginAccount,
    });

    switch (data.tipo) {
      case TransactionTypeEnum.DEPOSIT:
        await this._repositories.accounts.addBalance(
          data.idContaDestino,
          data.valor
        );
        break;
      case TransactionTypeEnum.TRANSFER:
        await this._repositories.accounts.removeBalance(
          idOriginAccount,
          data.valor
        );
        await this._repositories.accounts.addBalance(
          data.idContaDestino,
          data.valor
        );
        break;
      case TransactionTypeEnum.WITHDRAWAL:
        await this._repositories.accounts.removeBalance(
          idOriginAccount,
          data.valor
        );
        break;
    }

    await endDatabaseTransaction();

    return right(newTransaction);
  }

  async findAll(
    idOriginAccount: string,
    idClient: string,
    role: RoleEnum
  ): Promise<Either<BaseError, TransactionEntity[]>> {
    const permission = hasPermission(role, RoleEnum.MANAGER);

    const account = await this._repositories.accounts.findById(idOriginAccount);

    if (!account) {
      return left(new NotFoundError(MESSAGES.error.account.NotFound));
    }

    if (account.idCliente !== idClient && !permission) {
      return left(new UnauthorizedError());
    }

    const transactions = await this._repositories.transactions.findAll(
      idOriginAccount
    );

    return right(transactions);
  }
}

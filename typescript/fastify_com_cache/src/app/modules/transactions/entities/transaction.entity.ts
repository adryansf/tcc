import { instanceToPlain, Transform } from "class-transformer";

// Types
import { TransactionTypeEnum } from "../enums/transaction-type.enum";
import { AccountEntity } from "../../accounts/entities/account.entity";

export class TransactionEntity {
  id: string;

  @Transform(({ value }) => Number(value))
  valor: number;

  tipo: TransactionTypeEnum;
  idContaOrigem: string;
  idContaDestino: string;
  dataDeCriacao: Date;

  @Transform(({ value }) => value && new AccountEntity(value))
  contaOrigem?: AccountEntity;

  @Transform(({ value }) => value && new AccountEntity(value))
  contaDestino?: AccountEntity;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    const plainObject = instanceToPlain(this);
    if (!plainObject.idContaOrigem) {
      delete plainObject.idContaOrigem;
    }
    if (!plainObject.idContaDestino) {
      delete plainObject.idContaDestino;
    }
    if (!plainObject?.contaOrigem) {
      delete plainObject.contaOrigem;
    }
    if (!plainObject?.contaDestino) {
      delete plainObject.contaDestino;
    }
    return plainObject;
  }
}

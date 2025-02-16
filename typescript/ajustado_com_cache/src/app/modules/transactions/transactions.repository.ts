// Database
import { db } from "@/database";

// Entities
import { TransactionEntity } from "./entities/transaction.entity";

// Types
import { TransactionTypeEnum } from "./enums/transaction-type.enum";

export interface ICreateTransactionData {
  tipo: TransactionTypeEnum;
  valor: number;
  idContaOrigem: string;
  idContaDestino: string;
}

interface ITransactionsRepository {
  create: (
    data: ICreateTransactionData
  ) => Promise<TransactionEntity | undefined>;
  findAll: (idConta: string) => Promise<TransactionEntity[]>;
}

export class TransactionsRepository implements ITransactionsRepository {
  async create(data: ICreateTransactionData) {
    const result = await db.query(
      `INSERT INTO "Transacao" (tipo, valor, "idContaOrigem", "idContaDestino") 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;`,
      [data.tipo, data.valor, data.idContaOrigem, data.idContaDestino]
    );
    return result?.rows[0] as TransactionEntity | undefined;
  }

  async findAll(idConta: string) {
    const result = await db.query(
      `SELECT * FROM "Transacao" t WHERE t."idContaOrigem" = $1 OR t."idContaDestino" = $2`,
      [idConta, idConta]
    );

    return (result?.rows || []) as TransactionEntity[];
  }
}

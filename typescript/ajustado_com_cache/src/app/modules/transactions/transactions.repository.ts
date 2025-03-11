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
      `SELECT 
          t.id AS id,
          t.valor AS valor,
          t.tipo AS tipo,
          t."dataDeCriacao" AS "dataDeCriacao",
          CASE 
              WHEN t."idContaOrigem" IS NOT NULL THEN 
                  json_build_object(
                      'id', o.id,
                      'numero', o.numero,
                      'tipo', o.tipo,
                      'dataDeCriacao', o."dataDeCriacao",
                      'dataDeAtualizacao', o."dataDeAtualizacao",
                      'cliente', json_build_object(
                          'id', cli_o.id,
                          'nome', cli_o.nome,
                          'cpf', cli_o.cpf,
                          'dataDeNascimento', cli_o."dataDeNascimento",
                          'telefone', cli_o.telefone,
                          'email', cli_o.email,
                          'dataDeCriacao', cli_o."dataDeCriacao",
                          'dataDeAtualizacao', cli_o."dataDeAtualizacao"
                      ),
                      'agencia', json_build_object(
                          'id', a_o.id,
                          'nome', a_o.nome,
                          'numero', a_o.numero,
                          'telefone', a_o.telefone,
                          'dataDeCriacao', a_o."dataDeCriacao",
                          'dataDeAtualizacao', a_o."dataDeAtualizacao"
                      )
                  )
              ELSE NULL 
          END AS "contaOrigem",
          CASE 
              WHEN t."idContaDestino" IS NOT NULL THEN 
                  json_build_object(
                      'id', d.id,
                      'numero', d.numero,
                      'tipo', d.tipo,
                      'dataDeCriacao', d."dataDeCriacao",
                      'dataDeAtualizacao', d."dataDeAtualizacao",
                      'cliente', json_build_object(
                          'id', cli_d.id,
                          'nome', cli_d.nome,
                          'cpf', cli_d.cpf,
                          'dataDeNascimento', cli_d."dataDeNascimento",
                          'telefone', cli_d.telefone,
                          'email', cli_d.email,
                          'dataDeCriacao', cli_d."dataDeCriacao",
                          'dataDeAtualizacao', cli_d."dataDeAtualizacao"
                      ),
                      'agencia', json_build_object(
                          'id', a_d.id,
                          'nome', a_d.nome,
                          'numero', a_d.numero,
                          'telefone', a_d.telefone,
                          'dataDeCriacao', a_d."dataDeCriacao",
                          'dataDeAtualizacao', a_d."dataDeAtualizacao"
                      )
                  )
              ELSE NULL 
          END AS "contaDestino"
      FROM "Transacao" t 
      LEFT JOIN "Conta" o ON t."idContaOrigem" = o.id
      LEFT JOIN "Cliente" cli_o ON o."idCliente" = cli_o.id
      LEFT JOIN "Agencia" a_o ON o."idAgencia" = a_o.id
      LEFT JOIN "Conta" d ON t."idContaDestino" = d.id
      LEFT JOIN "Cliente" cli_d ON d."idCliente" = cli_d.id
      LEFT JOIN "Agencia" a_d ON d."idAgencia" = a_d.id
      WHERE t."idContaOrigem" = $1 OR t."idContaDestino" = $2
      ORDER BY t."dataDeCriacao" DESC;
      `,
      [idConta, idConta]
    );

    return (result?.rows || []) as TransactionEntity[];
  }
}

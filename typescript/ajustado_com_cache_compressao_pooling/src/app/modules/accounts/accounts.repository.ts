// Database
import { db } from "@/database";

// Entities
import { AccountEntity } from "./entities/account.entity";
import { AccountTypeEnum } from "./enums/account-type.enum";

export interface ICreateAccountData {
  tipo: AccountTypeEnum;
  idAgencia: string;
  idCliente: string;
}

export interface IQueryFindAllAccounts {
  cpf: string;
}

interface IAccountsRepository {
  create: (data: ICreateAccountData) => Promise<AccountEntity | undefined>;
  findById: (id: string) => Promise<AccountEntity | undefined>;
  addBalance: (id: string, value: number) => Promise<void>;
  removeBalance: (id: string, value: number) => Promise<void>;
  findAll: (query: IQueryFindAllAccounts) => Promise<Partial<AccountEntity>[]>;
}

export class AccountsRepository implements IAccountsRepository {
  async create(data: ICreateAccountData) {
    const result = await db.query(
      `INSERT INTO "Conta" (tipo, "idAgencia", "idCliente") VALUES ($1, $2, $3) RETURNING *`,
      [data.tipo, data.idAgencia, data.idCliente]
    );
    return result?.rows[0] as AccountEntity | undefined;
  }

  async findAll(query: IQueryFindAllAccounts) {
    const result = await db.query(
      `SELECT 
        c.id AS id,
        c.numero AS numero,
        c.tipo AS tipo,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" as "dataDeAtualizacao",
        json_build_object(
          'id', cli.id,
          'nome', cli.nome,
          'cpf', cli.cpf,
          'telefone', cli.telefone,
          'email', cli.email,
          'dataDeCriacao', cli."dataDeCriacao",
          'dataDeAtualizacao', cli."dataDeAtualizacao"
        ) AS cliente,
        json_build_object(
          'id', a.id,
          'nome', a.nome,
          'numero', a.numero,
          'telefone', a.telefone,
          'dataDeCriacao', a."dataDeCriacao",
          'dataDeAtualizacao', a."dataDeAtualizacao"
        ) AS agencia
      FROM "Conta" c
      JOIN "Cliente" cli ON c."idCliente" = cli.id
      JOIN "Agencia" a ON c."idAgencia" = a.id
      WHERE cli.cpf = $1`,
      [query.cpf]
    );

    return (result?.rows || []) as Partial<AccountEntity>[];
  }

  async findById(id: string, join: boolean = false) {
    const result = await db.query(
      `SELECT 
        c.id AS id,
        c.numero AS numero,
        c.saldo AS saldo,
        c.tipo AS tipo,
        c."idAgencia" AS "idAgencia",
        c."idCliente" AS "idCliente",
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" as "dataDeAtualizacao"
        ${
          join
            ? `,json_build_object(
          'id', cli.id,
          'nome', cli.nome,
          'cpf', cli.cpf,
          'telefone', cli.telefone,
          'email', cli.email,
          'dataDeCriacao', cli."dataDeCriacao",
          'dataDeAtualizacao', cli."dataDeAtualizacao"
        ) AS cliente,
        json_build_object(
          'id', a.id,
          'nome', a.nome,
          'numero', a.numero,
          'telefone', a.telefone,
          'dataDeCriacao', a."dataDeCriacao",
          'dataDeAtualizacao', a."dataDeAtualizacao"
        ) AS agencia`
            : ""
        }
      FROM "Conta" c
      ${
        join
          ? ` JOIN "Cliente" cli ON c."idCliente" = cli.id
      JOIN "Agencia" a ON c."idAgencia" = a.id`
          : ""
      }
      WHERE c.id = $1 LIMIT 1`,
      [id]
    );

    return result?.rows[0] as AccountEntity | undefined;
  }

  async addBalance(id: string, value: number) {
    await db.query(
      `
      UPDATE "Conta"
      SET saldo = saldo + $1
      WHERE id = $2
    `,
      [value, id]
    );

    return;
  }

  async removeBalance(id: string, value: number) {
    await db.query(
      `
      UPDATE "Conta"
      SET saldo = saldo - $1
      WHERE id = $2
    `,
      [value, id]
    );

    return;
  }

  async delete(id: string) {
    await db.query(
      `
      DELETE FROM "Conta"
      WHERE id = $1
      `,
      [id]
    );

    return;
  }
}

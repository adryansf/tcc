import { Knex } from "knex";

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
  create: (data: ICreateAccountData) => Promise<AccountEntity | null>;
  findById: (id: string) => Promise<AccountEntity | undefined>;
  addBalance: (
    id: string,
    value: number,
    trx: Knex.Transaction
  ) => Promise<void>;
  removeBalance: (
    id: string,
    value: number,
    trx: Knex.Transaction
  ) => Promise<void>;
  findAll: (query: IQueryFindAllAccounts) => Promise<Partial<AccountEntity>[]>;
}

export class AccountsRepository implements IAccountsRepository {
  async create(data: ICreateAccountData) {
    const trx = await db.transaction();
    try {
      const result = await trx.raw(
        `INSERT INTO "Conta" (tipo, "idAgencia", "idCliente") VALUES (?, ?, ?) RETURNING *`,
        [data.tipo, data.idAgencia, data.idCliente]
      );
      await trx.commit();
      return result.rows[0] as AccountEntity | undefined;
    } catch (error) {
      await trx.rollback();
      return null;
    }
  }

  async findAll(query: IQueryFindAllAccounts) {
    const result = await db.raw(
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
          'dataDeNascimento', cli."dataDeNascimento",
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
      WHERE cli.cpf = ?`,
      [query.cpf]
    );
    return result.rows as Partial<AccountEntity>[];
  }

  async findById(id: string, join: boolean = false) {
    const query = `
      SELECT 
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
          'dataDeNascimento', cli."dataDeNascimento",
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
      WHERE c.id = ? LIMIT 1
    `;
    const result = await db.raw(query, [id]);
    return result.rows[0] as AccountEntity | undefined;
  }

  async addBalance(id: string, value: number, trx: Knex.Transaction) {
    await trx.raw(`UPDATE "Conta" SET saldo = saldo + ? WHERE id = ?`, [
      value,
      id,
    ]);
  }

  async removeBalance(id: string, value: number, trx: Knex.Transaction) {
    await trx.raw(`UPDATE "Conta" SET saldo = saldo - ? WHERE id = ?`, [
      value,
      id,
    ]);
  }

  async delete(id: string) {
    await db.raw(`DELETE FROM "Conta" WHERE id = ?`, [id]);
  }
}

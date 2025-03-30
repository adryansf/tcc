// Database
import { db } from "@/database";

// Entities
import { ClientEntity } from "./entities/client.entity";

export interface ICreateClientData {
  nome: string;
  cpf: string;
  telefone: string;
  dataDeNascimento: string;
  email: string;
  senha: string;
}

export interface IQueryFindAllClients {
  cpf: string;
}

interface IClientsRepository {
  findById: (id: string) => Promise<Partial<ClientEntity> | undefined>;
  findByCPF: (cpf: string) => Promise<Partial<ClientEntity> | undefined>;
  findByEmail: (email: string) => Promise<Partial<ClientEntity> | undefined>;
  create: (data: ICreateClientData) => Promise<Partial<ClientEntity> | null>;
  findAll: (quantidade: number) => Promise<Partial<ClientEntity>[]>;
}

export class ClientsRepository implements IClientsRepository {
  async findById(id: string) {
    const result = await db.raw(
      `SELECT 
        c.id, 
        c.cpf as cpf,
        c.nome AS nome,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao",
        CASE 
          WHEN e.id IS NOT NULL THEN 
            json_build_object(
              'logradouro', e.logradouro,
              'numero', e.numero,
              'bairro', e.bairro,
              'cidade', e.cidade,
              'uf', e.uf,
              'complemento', e.complemento,
              'cep', e.cep,
              'dataDeCriacao', e."dataDeCriacao",
              'dataDeAtualizacao', e."dataDeAtualizacao"
              ) 
          ELSE NULL 
        END AS endereco 
      FROM "Cliente" c
      LEFT JOIN "Endereco" e ON e."idCliente" = c.id
      WHERE c.id = ? LIMIT 1`,
      [id]
    );
    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async findByEmail(email: string) {
    const result = await db.raw(
      `SELECT 
        c.id, 
        c.cpf as cpf,
        c.nome AS nome,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao",
        CASE 
          WHEN e.id IS NOT NULL THEN 
            json_build_object(
              'logradouro', e.logradouro,
              'numero', e.numero,
              'bairro', e.bairro,
              'cidade', e.cidade,
              'uf', e.uf,
              'complemento', e.complemento,
              'cep', e.cep,
              'dataDeCriacao', e."dataDeCriacao",
              'dataDeAtualizacao', e."dataDeAtualizacao"
              ) 
          ELSE NULL 
        END AS endereco 
      FROM "Cliente" c
      LEFT JOIN "Endereco" e ON e."idCliente" = c.id
      WHERE c.email = ? LIMIT 1`,
      [email]
    );
    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async findByCPF(cpf: string) {
    const result = await db.raw(
      `SELECT 
        c.id, 
        c.cpf as cpf,
        c.nome AS nome,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao",
        CASE 
          WHEN e.id IS NOT NULL THEN 
            json_build_object(
              'logradouro', e.logradouro,
              'numero', e.numero,
              'bairro', e.bairro,
              'cidade', e.cidade,
              'uf', e.uf,
              'complemento', e.complemento,
              'cep', e.cep,
              'dataDeCriacao', e."dataDeCriacao",
              'dataDeAtualizacao', e."dataDeAtualizacao"
              ) 
          ELSE NULL 
        END AS endereco 
      FROM "Cliente" c
      LEFT JOIN "Endereco" e ON e."idCliente" = c.id
      WHERE c.cpf = ? LIMIT 1`,
      [cpf]
    );
    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async create(data: ICreateClientData) {
    const trx = await db.transaction();
    try {
      const result = await trx.raw(
        `INSERT INTO "Cliente" (nome, cpf, telefone, "dataDeNascimento", email, senha) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
        [
          data.nome,
          data.cpf,
          data.telefone,
          data.dataDeNascimento,
          data.email,
          data.senha,
        ]
      );
      await trx.commit();
      return result.rows[0] as Partial<ClientEntity> | undefined;
    } catch (error) {
      await trx.rollback();
      return null;
    }
  }

  async findAll(quantidade: number) {
    const result = await db.raw(
      `SELECT 
        c.id, 
        c.cpf as cpf,
        c.nome AS nome,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao"
      FROM "Cliente" c
      LIMIT ?`,
      [quantidade]
    );
    return result.rows as Partial<ClientEntity>[];
  }
}

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
  create: (data: ICreateClientData) => Promise<Partial<ClientEntity>>;
}

export class ClientsRepository implements IClientsRepository {
  async findById(id: string) {
    const result = await db.query(
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
      WHERE c.id = $1 LIMIT 1`,
      [id]
    );

    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async findByEmail(email: string) {
    const result = await db.query(
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
      WHERE c.email = $1 LIMIT 1`,
      [email]
    );

    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async findByCPF(cpf: string) {
    const result = await db.query(
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
      WHERE c.cpf = $1 LIMIT 1`,
      [cpf]
    );

    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async create(data: ICreateClientData) {
    const result = await db.query(
      `INSERT INTO "Cliente" (nome, cpf, telefone, "dataDeNascimento", email, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.nome,
        data.cpf,
        data.telefone,
        data.dataDeNascimento,
        data.email,
        data.senha,
      ]
    );

    return result.rows[0] as Partial<ClientEntity> | undefined;
  }
}

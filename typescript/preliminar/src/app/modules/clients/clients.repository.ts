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

interface IClientsRepository {
  findById: (id: string) => Promise<Partial<ClientEntity> | undefined>;
  create: (data: ICreateClientData) => Promise<Partial<ClientEntity>>;
}

export class ClientsRepository implements IClientsRepository {
  async findById(id: string) {
    const result = await db.query(
      `SELECT * FROM "Cliente" c WHERE c.id = $1 LIMIT 1`,
      [id]
    );

    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async findByEmail(email: string) {
    const result = await db.query(
      `SELECT * FROM "Cliente" c WHERE c.email = $1 LIMIT 1`,
      [email]
    );

    return result.rows[0] as Partial<ClientEntity> | undefined;
  }

  async findByCPF(cpf: string) {
    const result = await db.query(
      `SELECT * FROM "Cliente" c WHERE c.cpf = $1 LIMIT 1`,
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

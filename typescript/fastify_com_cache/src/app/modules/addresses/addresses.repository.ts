// Database
import { db } from "@/database";

// Entities
import { AddressEntity } from "./entities/address.entity";

export interface ICreateAddressData {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  idCliente: string;
  complemento: string;
}

interface IAddressesRepository {
  create: (data: ICreateAddressData) => Promise<AddressEntity | null>;
  findByIdClient: (idClient: string) => Promise<AddressEntity | undefined>;
}

export class AddressesRepository implements IAddressesRepository {
  async create(data: ICreateAddressData) {
    const trx = await db.transaction();
    try {
      const result = await trx.raw(
        `INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        [
          data.logradouro,
          data.numero,
          data.bairro,
          data.cidade,
          data.uf,
          data.cep,
          data.idCliente,
          data.complemento,
        ]
      );
      await trx.commit();
      return result.rows[0] as AddressEntity | undefined;
    } catch (error) {
      await trx.rollback();
      return null;
    }
  }

  async findByIdClient(idClient: string) {
    const result = await db.raw(
      `SELECT * FROM "Endereco" e WHERE e."idCliente" = ?`,
      [idClient]
    );
    return result.rows[0] as AddressEntity | undefined;
  }
}

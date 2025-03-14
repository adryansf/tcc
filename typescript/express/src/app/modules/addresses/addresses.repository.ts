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
  create: (data: ICreateAddressData) => Promise<AddressEntity | undefined>;
  findByIdClient: (idClient: string) => Promise<AddressEntity | undefined>;
}

export class AddressesRepository implements IAddressesRepository {
  async create(data: ICreateAddressData) {
    const result = await db.query(
      `INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
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
    return result?.rows[0] as AddressEntity | undefined;
  }

  async findByIdClient(idClient: string) {
    const result = await db.query(
      `SELECT * FROM "Endereco" e WHERE e."idCliente" = $1`,
      [idClient]
    );

    return result?.rows[0] as AddressEntity | undefined;
  }
}

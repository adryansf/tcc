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
  create: (data: ICreateAddressData) => Promise<Partial<AddressEntity> | null>;
  findById: (id: string) => Promise<Partial<AddressEntity> | undefined>;
  findByIdClient: (
    idCliente: string
  ) => Promise<Partial<AddressEntity> | undefined>;
}

export class AddressesRepository implements IAddressesRepository {
  async create(data: ICreateAddressData) {
    const result = await AddressEntity.create({
      logradouro: data.logradouro,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      cep: data.cep,
      idCliente: data.idCliente,
      complemento: data.complemento,
    });
    return result;
  }

  async findById(id: string) {
    const result = await AddressEntity.findOne({
      where: { id },
      limit: 1,
    });
    return result || undefined;
  }

  async findByIdClient(idCliente: string) {
    const result = await AddressEntity.findOne({
      where: { idCliente },
      limit: 1,
    });
    return result || undefined;
  }
}

// Entities
import { ClientEntity } from "./entities/client.entity";
import { AddressEntity } from "@/app/modules/addresses/entities/address.entity";

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
  findById: (id: string) => Promise<ClientEntity>;
  findByCPF: (cpf: string) => Promise<ClientEntity>;
  findByEmail: (email: string) => Promise<ClientEntity>;
  create: (data: ICreateClientData) => Promise<ClientEntity>;
  findAll: (quantidade: number) => Promise<ClientEntity[]>;
}

export class ClientsRepository implements IClientsRepository {
  async findById(id: string) {
    const result = await ClientEntity.findOne({
      where: { id },
      include: [
        {
          model: AddressEntity,
          as: "endereco",
          attributes: { exclude: ["idCliente"] },
        },
      ],
    });
    return result;
  }

  async findByEmail(email: string) {
    const result = await ClientEntity.findOne({
      where: { email },
      include: [
        {
          model: AddressEntity,
          as: "endereco",
          attributes: { exclude: ["idCliente"] },
        },
      ],
    });
    return result;
  }

  async findByCPF(cpf: string) {
    const result = await ClientEntity.findOne({
      where: { cpf },
      include: [
        {
          model: AddressEntity,
          as: "endereco",
          attributes: { exclude: ["idCliente"] },
        },
      ],
    });
    return result;
  }

  async create(data: ICreateClientData) {
    const result = await ClientEntity.create({
      nome: data.nome,
      cpf: data.cpf,
      telefone: data.telefone,
      dataDeNascimento: data.dataDeNascimento,
      email: data.email,
      senha: data.senha,
    });
    return result;
  }

  async findAll(quantidade: number) {
    const result = await ClientEntity.findAll({
      limit: quantidade,
    });
    return result;
  }
}

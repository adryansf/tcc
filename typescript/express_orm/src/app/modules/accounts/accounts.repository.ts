// Entities
import { AccountEntity } from "./entities/account.entity";
import { AccountTypeEnum } from "./enums/account-type.enum";
import { sequelize } from "@/database";
import { Transaction } from "sequelize";

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
  addBalance: (id: string, value: number, trx: Transaction) => Promise<void>;
  removeBalance: (id: string, value: number, trx: Transaction) => Promise<void>;
  findAll: (query: IQueryFindAllAccounts) => Promise<Partial<AccountEntity>[]>;
}

export class AccountsRepository implements IAccountsRepository {
  async create(data: ICreateAccountData) {
    const result = await AccountEntity.create({
      ...data,
    });

    return result;
  }

  async findAll(query: IQueryFindAllAccounts) {
    const result = await AccountEntity.findAll({
      include: [
        {
          model: sequelize.models.ClientEntity,
          as: "cliente",
          where: { cpf: query.cpf },
          attributes: [
            "id",
            "nome",
            "cpf",
            "dataDeNascimento",
            "telefone",
            "email",
            "dataDeCriacao",
            "dataDeAtualizacao",
          ],
        },
        {
          model: sequelize.models.BranchEntity,
          as: "agencia",
          attributes: [
            "id",
            "nome",
            "numero",
            "telefone",
            "dataDeCriacao",
            "dataDeAtualizacao",
          ],
        },
      ],
      attributes: [
        "id",
        "numero",
        "tipo",
        "dataDeCriacao",
        "dataDeAtualizacao",
      ],
    });

    return result;
  }

  async findById(id: string, join: boolean = false) {
    const options: any = {
      where: { id },
      limit: 1,
    };

    if (join) {
      options.include = [
        {
          model: sequelize.models.ClientEntity,
          as: "cliente",
          attributes: [
            "id",
            "nome",
            "cpf",
            "dataDeNascimento",
            "telefone",
            "email",
            "dataDeCriacao",
            "dataDeAtualizacao",
          ],
        },
        {
          model: sequelize.models.BranchEntity,
          as: "agencia",
          attributes: [
            "id",
            "nome",
            "numero",
            "telefone",
            "dataDeCriacao",
            "dataDeAtualizacao",
          ],
        },
      ];
    }

    const result = await AccountEntity.findOne(options);
    return result || undefined;
  }

  async addBalance(id: string, value: number, trx: Transaction) {
    await AccountEntity.update(
      { saldo: sequelize.literal(`saldo + ${value}`) },
      { where: { id }, transaction: trx }
    );
  }

  async removeBalance(id: string, value: number, trx: Transaction) {
    await AccountEntity.update(
      { saldo: sequelize.literal(`saldo - ${value}`) },
      { where: { id }, transaction: trx }
    );
  }

  async delete(id: string) {
    await AccountEntity.destroy({ where: { id } });
  }
}

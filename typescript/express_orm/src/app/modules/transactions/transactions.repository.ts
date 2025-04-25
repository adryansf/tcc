// Database
import { sequelize } from "@/database";

// Entities
import { TransactionEntity } from "./entities/transaction.entity";

// Types
import { TransactionTypeEnum } from "./enums/transaction-type.enum";
import { Transaction, Op } from "sequelize";

export interface ICreateTransactionData {
  tipo: TransactionTypeEnum;
  valor: number;
  idContaOrigem: string;
  idContaDestino: string;
}

interface ITransactionsRepository {
  create: (
    data: ICreateTransactionData,
    trx: Transaction
  ) => Promise<TransactionEntity | undefined>;
  findAll: (idConta: string) => Promise<TransactionEntity[]>;
}

export class TransactionsRepository implements ITransactionsRepository {
  async create(data: ICreateTransactionData, trx: Transaction) {
    const result = await TransactionEntity.create(
      {
        tipo: data.tipo,
        valor: data.valor,
        idContaOrigem: data.idContaOrigem || null,
        idContaDestino: data.idContaDestino || null,
      },
      { transaction: trx }
    );

    return result;
  }

  async findAll(idConta: string) {
    const result = await TransactionEntity.findAll({
      where: {
        [Op.or]: [{ idContaOrigem: idConta }, { idContaDestino: idConta }],
      },
      order: [["dataDeCriacao", "DESC"]],
      attributes: ["id", "tipo", "valor", "dataDeCriacao"],
      include: [
        {
          model: sequelize.models.AccountEntity,
          as: "contaOrigem",
          include: [
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
          ],
          attributes: [
            "id",
            "numero",
            "tipo",
            "dataDeCriacao",
            "dataDeAtualizacao",
          ],
        },
        {
          model: sequelize.models.AccountEntity,
          as: "contaDestino",
          attributes: [
            "id",
            "numero",
            "tipo",
            "dataDeCriacao",
            "dataDeAtualizacao",
          ],
        },
      ],
    });

    return result;
  }
}

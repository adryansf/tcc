import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/database";
import { AccountEntity } from "@/app/modules/accounts/entities/account.entity";
import { TransactionTypeEnum } from "../enums/transaction-type.enum";

export class TransactionEntity extends Model {
  declare id: string;
  declare valor: number;
  declare tipo: TransactionTypeEnum;
  declare idContaOrigem: string;
  declare idContaDestino: string;
  declare dataDeCriacao: Date;

  toJSON() {
    const values = { ...this.get() };
    if (values.valor) {
      values.valor = Number(values.valor);
    }
    if (values.idContaOrigem === null) {
      delete values.idContaOrigem;
    }
    if (values.idContaDestino === null) {
      delete values.idContaDestino;
    }

    if (values.contaOrigem === null) {
      delete values.contaOrigem;
    }
    if (values.contaDestino === null) {
      delete values.contaDestino;
    }

    return values;
  }
}

TransactionEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    valor: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(TransactionTypeEnum)),
      allowNull: false,
    },
    idContaOrigem: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Conta",
        key: "id",
      },
    },
    idContaDestino: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Conta",
        key: "id",
      },
    },
    dataDeCriacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Transacao",
    timestamps: true,
    createdAt: "dataDeCriacao",
    updatedAt: false,
  }
);

TransactionEntity.belongsTo(AccountEntity, {
  foreignKey: "idContaOrigem",
  as: "contaOrigem",
});
TransactionEntity.belongsTo(AccountEntity, {
  foreignKey: "idContaDestino",
  as: "contaDestino",
});

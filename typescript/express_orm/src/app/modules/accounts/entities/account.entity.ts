import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/database";
import { ClientEntity } from "@/app/modules/clients/entities/client.entity";
import { BranchEntity } from "@/app/modules/branchs/entities/branch.entity";
import { AccountTypeEnum } from "../enums/account-type.enum";

export class AccountEntity extends Model {
  declare id: string;
  declare numero: number;
  declare saldo: number;
  declare tipo: AccountTypeEnum;
  declare idAgencia: string;
  declare idCliente: string;
  declare dataDeCriacao: Date;
  declare dataDeAtualizacao: Date;

  toJSON() {
    const values = { ...this.get() };
    if (values.saldo) {
      values.saldo = Number(values.saldo);
    }
    return values;
  }
}

AccountEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    saldo: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(AccountTypeEnum)),
      allowNull: false,
    },
    idAgencia: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Agencia",
        key: "id",
      },
    },
    idCliente: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Cliente",
        key: "id",
      },
    },
    dataDeCriacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dataDeAtualizacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Conta",
    timestamps: true,
    createdAt: "dataDeCriacao",
    updatedAt: "dataDeAtualizacao",
  }
);

AccountEntity.belongsTo(ClientEntity, {
  foreignKey: "idCliente",
  as: "cliente",
});
ClientEntity.hasMany(AccountEntity, { foreignKey: "idCliente", as: "contas" });

AccountEntity.belongsTo(BranchEntity, {
  foreignKey: "idAgencia",
  as: "agencia",
});
BranchEntity.hasMany(AccountEntity, { foreignKey: "idAgencia", as: "contas" });

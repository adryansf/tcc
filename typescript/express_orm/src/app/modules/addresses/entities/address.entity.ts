import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/database";

export class AddressEntity extends Model {
  declare id: string;
  declare logradouro: string;
  declare numero: string;
  declare bairro: string;
  declare cidade: string;
  declare uf: string;
  declare complemento: string | null;
  declare cep: string;
  declare idCliente: string;
  declare dataDeCriacao: Date;
  declare dataDeAtualizacao: Date;

  toJSON() {
    const values = { ...this.get() };
    return values;
  }
}

AddressEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    logradouro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "Endereco",
    timestamps: true,
    createdAt: "dataDeCriacao",
    updatedAt: "dataDeAtualizacao",
  }
);

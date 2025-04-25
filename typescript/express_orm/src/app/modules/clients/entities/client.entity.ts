import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/database";
import { AddressEntity } from "@/app/modules/addresses/entities/address.entity";

export class ClientEntity extends Model {
  declare id: string;
  declare nome: string;
  declare cpf: string;
  declare telefone: string;
  declare dataDeNascimento: Date;
  declare email: string;
  declare senha: string;
  declare dataDeCriacao: Date;
  declare dataDeAtualizacao: Date;

  toJSON() {
    const values = { ...this.get() };
    delete values.senha;
    if (!values.endereco) {
      delete values.endereco;
    }
    return values;
  }
}

ClientEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataDeNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "Cliente",
    timestamps: true,
    createdAt: "dataDeCriacao",
    updatedAt: "dataDeAtualizacao",
  }
);

ClientEntity.hasOne(AddressEntity, {
  foreignKey: "idCliente",
  as: "endereco",
});
AddressEntity.belongsTo(ClientEntity, {
  foreignKey: "idCliente",
  as: "endereco",
});

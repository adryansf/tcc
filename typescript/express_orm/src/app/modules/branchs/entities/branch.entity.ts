import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/database";

export class BranchEntity extends Model {
  declare id: string;
  declare nome: string;
  declare numero: number;
  declare telefone: string;
  declare dataDeCriacao: Date;
  declare dataDeAtualizacao: Date;

  toJSON() {
    const values = { ...this.get() };
    return values;
  }
}

BranchEntity.init(
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
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    telefone: {
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
    tableName: "Agencia",
    timestamps: true,
    createdAt: "dataDeCriacao",
    updatedAt: "dataDeAtualizacao",
  }
);

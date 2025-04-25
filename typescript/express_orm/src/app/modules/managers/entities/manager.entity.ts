import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/database";
import { BranchEntity } from "@/app/modules/branchs/entities/branch.entity";

export class ManagerEntity extends Model {
  declare id: string;
  declare idAgencia: string;
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
    return values;
  }
}

ManagerEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    idAgencia: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Agencia",
        key: "id",
      },
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
    tableName: "Gerente",
    timestamps: true,
    createdAt: "dataDeCriacao",
    updatedAt: "dataDeAtualizacao",
  }
);

ManagerEntity.belongsTo(BranchEntity, { foreignKey: "idAgencia" });
BranchEntity.hasMany(ManagerEntity, { foreignKey: "idAgencia" });

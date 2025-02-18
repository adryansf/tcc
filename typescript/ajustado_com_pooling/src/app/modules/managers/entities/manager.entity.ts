import { Exclude, instanceToPlain, Transform } from "class-transformer";
import { BranchEntity } from "../../branchs/entities/branch.entity";

export class ManagerEntity {
  id: string;
  idAgencia: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataDeNascimento: Date;
  email: string;

  @Exclude()
  senha: string;

  dataDeCriacao: Date;
  dataDeAtualizacao: Date;

  @Transform(({ value }) => value && new BranchEntity(value))
  agencia?: BranchEntity;

  constructor(partial: Partial<ManagerEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

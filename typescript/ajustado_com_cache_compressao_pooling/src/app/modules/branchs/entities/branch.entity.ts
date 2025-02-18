import { instanceToPlain } from "class-transformer";

export class BranchEntity {
  id: string;
  nome: string;
  numero: string;
  telefone: string;
  dataDeCriacao: Date;
  dataDeAtualizacao: Date;

  constructor(partial: Partial<BranchEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

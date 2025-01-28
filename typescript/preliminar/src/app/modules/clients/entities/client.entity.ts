import { Exclude, instanceToPlain } from "class-transformer";

export class ClientEntity {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataDeNascimento: Date;
  email: string;

  @Exclude()
  senha: string;

  dataDeCriacao: Date;
  dataDeAtualizacao: Date;

  constructor(partial: Partial<ClientEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

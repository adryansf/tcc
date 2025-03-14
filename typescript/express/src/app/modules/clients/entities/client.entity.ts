import { Exclude, instanceToPlain, Transform } from "class-transformer";
import { AddressEntity } from "@/app/modules/addresses/entities/address.entity";

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

  @Transform(({ value }) => value && new AddressEntity(value))
  endereco?: AddressEntity;

  constructor(partial: Partial<ClientEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

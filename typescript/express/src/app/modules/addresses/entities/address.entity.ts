import { instanceToPlain } from "class-transformer";

export class AddressEntity {
  id: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string | null;
  cep: string;
  idCliente: string;
  dataDeCriacao: Date;
  dataDeAtualizacao: Date;

  constructor(partial: Partial<AddressEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

import { instanceToPlain, Transform } from "class-transformer";

// Types
import { AccountTypeEnum } from "../enums/account-type.enum";
import { ClientEntity } from "../../clients/entities/client.entity";
import { BranchEntity } from "../../branchs/entities/branch.entity";

export class AccountEntity {
  id: string;
  numero: number;

  @Transform(({ value }) => value && Number(value))
  saldo: number;

  tipo: AccountTypeEnum;
  idAgencia: string;
  idCliente: string;
  dataDeCriacao: Date;
  dataDeAtualizacao: Date;

  @Transform(({ value }) => value && new ClientEntity(value))
  cliente?: ClientEntity;

  @Transform(({ value }) => value && new ClientEntity(value))
  agencia?: BranchEntity;

  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

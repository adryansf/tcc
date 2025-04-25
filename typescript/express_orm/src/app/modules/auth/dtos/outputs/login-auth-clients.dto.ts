import { Transform, instanceToPlain } from "class-transformer";

// Entities
import { ClientEntity } from "@/app/modules/clients/entities/client.entity";

export class LoginAuthClientsOutputDto {
  @Transform(({ value }) => value.toJSON())
  usuario: Partial<ClientEntity>;

  token: string;
  expiraEm: string;

  constructor(partial: Partial<LoginAuthClientsOutputDto>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

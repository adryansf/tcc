import { Transform, instanceToPlain } from "class-transformer";

// Entities
import { ClientEntity } from "@/app/modules/clients/entities/client.entity";

export class LoginAuthClientsOutputDto {
  @Transform(({ value }) => new ClientEntity(value))
  client: Partial<ClientEntity>;

  token: string;
  expiresIn: number; // seconds

  constructor(partial: Partial<LoginAuthClientsOutputDto>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

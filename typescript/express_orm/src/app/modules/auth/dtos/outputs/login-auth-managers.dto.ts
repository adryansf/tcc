import { Transform, instanceToPlain } from "class-transformer";

// Entities
import { ManagerEntity } from "@/app/modules/managers/entities/manager.entity";

export class LoginAuthManagersOutputDto {
  @Transform(({ value }) => value.toJSON())
  usuario: Partial<ManagerEntity>;

  token: string;
  expiraEm: string; // seconds

  constructor(partial: Partial<LoginAuthManagersOutputDto>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

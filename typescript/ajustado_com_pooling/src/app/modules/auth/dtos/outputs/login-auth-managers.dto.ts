import { Transform, instanceToPlain } from "class-transformer";

// Entities
import { ManagerEntity } from "@/app/modules/managers/entities/manager.entity";

export class LoginAuthManagersOutputDto {
  @Transform(({ value }) => new ManagerEntity(value))
  manager: Partial<ManagerEntity>;

  token: string;
  expiresIn: number; // seconds

  constructor(partial: Partial<LoginAuthManagersOutputDto>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

import { RoleEnum } from "@/common/enums/role.enum";

export interface JwtPayload {
  id: string;
  email: string;
  role: RoleEnum;
  cpf: string;
}

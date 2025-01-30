import { RoleEnum } from "../../roles/enums";

export interface JwtPayload {
  id: string;
  email: string;
  role: RoleEnum;
}

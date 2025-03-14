import { RoleEnum } from "@/app/common/enums/role.enum";

export const hasPermission = (
  role: RoleEnum,
  ...rolesPermitted: RoleEnum[]
) => {
  return rolesPermitted.includes(role);
};

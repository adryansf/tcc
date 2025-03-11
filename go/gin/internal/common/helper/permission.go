package helper

import "tcc/internal/common/enum"

func HasPermission(role enum.RoleEnum, rolesPermitted ...enum.RoleEnum) bool {
	for _, permittedRole := range rolesPermitted {
		if role == permittedRole {
			return true
		}
	}
	return false
}

package auth

import "tcc/internal/common/enum"

type JwtPayload struct{
	ID string
  Email string
  Role enum.RoleEnum
  CPF string
}
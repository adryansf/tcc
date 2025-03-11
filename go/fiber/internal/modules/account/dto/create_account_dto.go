package dto

import (
	"tcc/internal/modules/account/enum"

	"github.com/google/uuid"
)



type CreateAccountDto struct {
	Tipo      enum.AccountTypeEnum `validate:"required,oneof=CORRENTE POUPANCA"`
	IdAgencia *uuid.UUID      `validate:"omitempty,uuid"`
	IdCliente *uuid.UUID      `validate:"omitempty,uuid"`
}
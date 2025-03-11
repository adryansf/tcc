package dto

import (
	"tcc/internal/modules/transaction/enum"
)

type CreateTransactionDto struct {
	Tipo           enum.TransactionTypeEnum `validate:"required,oneof=DEPOSITO SAQUE TRANSFERENCIA"`
	IDContaOrigem  *string                `validate:"omitempty,uuid"`
	IDContaDestino *string                `validate:"omitempty,uuid"`
	Valor          float64                   `validate:"gt=0"`
}
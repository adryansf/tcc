package validator

import (
	"tcc/internal/modules/transaction/dto"
	"tcc/internal/modules/transaction/enum"

	v "github.com/go-playground/validator/v10"
)

func ValidateTransaction(sl v.StructLevel) {
	transaction := sl.Current().Interface().(dto.CreateTransactionDto)

	switch transaction.Tipo {
	case enum.DEPOSIT:
		if transaction.IDContaDestino == nil {
			sl.ReportError(transaction.IDContaDestino, "IdContaDestino", "IdContaDestino", string(enum.DEPOSIT), "")
		}
	case enum.WITHDRAWAL:
		if transaction.IDContaOrigem == nil {
			sl.ReportError(transaction.IDContaOrigem, "IdContaOrigem", "IdContaOrigem", string(enum.WITHDRAWAL), "")
		}
	case enum.TRANSFER:
		if transaction.IDContaOrigem == nil || transaction.IDContaDestino == nil {
			sl.ReportError(transaction.IDContaOrigem, "IdContaOrigem", "IdContaOrigem", string(enum.TRANSFER), "")
		}
	}
}

package enum

type TransactionTypeEnum string

const (
	DEPOSIT    TransactionTypeEnum = "DEPOSITO"
	WITHDRAWAL TransactionTypeEnum = "SAQUE"
	TRANSFER   TransactionTypeEnum = "TRANSFERENCIA"
)

package dto

type FindAllQueryTransactionsDto struct {
	IDConta *string `validate:"omitempty,uuid"`
}
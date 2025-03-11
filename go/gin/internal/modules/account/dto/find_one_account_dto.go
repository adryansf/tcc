package dto

type FindOneAccountDto struct {
	ID string `validate:"required,uuid"`
}
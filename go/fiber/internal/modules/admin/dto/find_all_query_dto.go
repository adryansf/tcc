package dto

type FindAllQueryDto struct {
	Quantidade int `validate:"number,gt=0"`
}
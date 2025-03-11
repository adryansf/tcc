package dto

import "tcc/internal/common/helper"

type FindAllQueryAccountDto struct {
	CPF string `validate:"required,cpf"`
}

func (dto *FindAllQueryAccountDto) Transform() {
	// CPF
	dto.CPF = helper.CleanDigits(dto.CPF)
}

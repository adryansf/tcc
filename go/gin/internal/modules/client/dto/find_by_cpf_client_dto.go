package dto

import "tcc/internal/common/helper"

type FindByCPFClientDto struct {
	CPF string `json:"cpf" validate:"required,cpf"`
}


func (dto *FindByCPFClientDto) Transform() {
	// CPF
	dto.CPF = helper.CleanDigits(dto.CPF)
}

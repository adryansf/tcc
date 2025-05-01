package dto

import (
	"tcc/internal/common/helper"
)

type CreateAddressDto struct {
	Logradouro  string `validate:"required"`
	Numero      string `validate:"required"`
	Bairro      string `validate:"required"`
	Cidade      string `validate:"required"`
	Uf          string `validate:"required,min=2,max=2"`
	Complemento string `validate:"omitempty"`
	Cep         string `validate:"required"`
}



func (dto *CreateAddressDto) Transform() {
  dto.Cep = helper.CleanDigits(dto.Cep)
}
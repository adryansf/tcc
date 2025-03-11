package dto

import (
	"strings"
	"tcc/internal/common/helper"
	"time"
)

type CreateClientDto struct {
	Nome            string `json:"nome" validate:"required,min=3"`
	CPF             string `json:"cpf" validate:"required,cpf"`
	Telefone        string `json:"telefone" validate:"required"`
	DataDeNascimento string `json:"dataDeNascimento" validate:"required,date_format"`
	Email           string `json:"email" validate:"required,email"`
	Senha           string `json:"senha" validate:"required,min=8,number"`
}

func (dto *CreateClientDto) Transform() {
	// Nome
	dto.Nome = strings.TrimSpace(dto.Nome)
	dto.Nome = helper.RemoveAccents(dto.Nome)
	dto.Nome = strings.ToUpper(dto.Nome)

	// CPF
	dto.CPF = helper.CleanDigits(dto.CPF)

	// Telefone
	dto.Telefone = helper.CleanDigits(dto.Telefone)

	// DataDeNascimento
	t, err := time.Parse("2001-11-09", dto.DataDeNascimento)
	if err == nil {
		dto.DataDeNascimento = t.Format("2001-11-09")
	}
}

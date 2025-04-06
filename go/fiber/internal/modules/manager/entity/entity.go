package entity

import (
	"encoding/json"
	"tcc/internal/modules/branch/entity"
	"tcc/internal/types"

	"github.com/google/uuid"
)

type ManagerEntity struct {
	ID               uuid.UUID             `json:"id"`
	IDAgencia        uuid.UUID             `json:"idAgencia"`
	Nome             string                `json:"nome"`
	CPF              string                `json:"cpf"`
	Telefone         string                `json:"telefone"`
	DataDeNascimento string             `json:"dataDeNascimento"`
	Email            string                `json:"email"`
	Senha            string                `json:"-"`
	DataDeCriacao    types.CustomTime             `json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime           `json:"dataDeAtualizacao"`
	Agencia          *entity.BranchEntity  `json:"agencia,omitempty"`
}

func ParseAgencia(agenciaJSON string) entity.BranchEntity {
	var agencia entity.BranchEntity
	if agenciaJSON != "" {
		json.Unmarshal([]byte(agenciaJSON), &agencia)
	}
	return agencia
}
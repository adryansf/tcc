package entity

import (
	"encoding/json"
	"tcc/internal/modules/account/enum"
	branch "tcc/internal/modules/branch/entity"
	client "tcc/internal/modules/client/entity"

	"github.com/google/uuid"
)

type AccountEntity struct {
	ID              *uuid.UUID        `json:"id,omitempty"`
	Numero          int           `json:"numero"`
	Saldo           *float64       `json:"saldo,omitempty"`
	Tipo            enum.AccountTypeEnum `json:"tipo"`
	IDAgencia       *uuid.UUID        `json:"idAgencia,omitempty"`
	IDCliente       *uuid.UUID        `json:"idCliente,omitempty"`
	DataDeCriacao   string     `json:"dataDeCriacao"`
	DataDeAtualizacao string   `json:"dataDeAtualizacao"`
	Cliente         *client.ClientEntity `json:"cliente,omitempty"`
	Agencia         *branch.BranchEntity `json:"agencia,omitempty"`
}


func ParseCliente(clienteJSON string) *client.ClientEntity {
	var cliente client.ClientEntity
	if clienteJSON != "" {
		json.Unmarshal([]byte(clienteJSON), &cliente)
	}
	return &cliente
}

func ParseAgencia(agenciaJSON string) *branch.BranchEntity {
	var agencia branch.BranchEntity
	if agenciaJSON != "" {
		json.Unmarshal([]byte(agenciaJSON), &agencia)
	}
	return &agencia
}
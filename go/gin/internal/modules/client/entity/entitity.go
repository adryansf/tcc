package entity

import (
	"encoding/json"
	"tcc/internal/modules/address/entity"
	"tcc/internal/types"

	"github.com/google/uuid"
)

type ClientEntity struct {
	ID              uuid.UUID       `json:"id"`
	Nome            string          `json:"nome"`
	CPF             string          `json:"cpf"`
	Telefone        string          `json:"telefone"`
	DataDeNascimento string       `json:"dataDeNascimento"`
	Email           string          `json:"email"`
	Senha           string          `json:"-"`
	DataDeCriacao   types.CustomTime       `json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime     `json:"dataDeAtualizacao"`
	Endereco        *entity.AddressEntity     `json:"endereco,omitempty"` 
}


func ParseEndereco(enderecoJSON string) *entity.AddressEntity {
	var endereco entity.AddressEntity
	if enderecoJSON != "" {
		json.Unmarshal([]byte(enderecoJSON), &endereco)
	}
	return &endereco
}
package entity

import (
	"tcc/internal/types"

	"github.com/google/uuid"
)

type AddressEntity struct {
	ID              *uuid.UUID     `json:"id,omitempty"`
	Logradouro      string     		`json:"logradouro"`
	Numero          string     		`json:"numero"`
	Bairro          string     		`json:"bairro"`
	Cidade          string     		`json:"cidade"`
	UF              string     		`json:"uf"`
	Complemento     *string    		`json:"complemento,omitempty"`
	CEP             string     		`json:"cep"`
	IDCliente       *uuid.UUID     `json:"idCliente,omitempty"`
	DataDeCriacao   types.CustomTime  		`json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime 	`json:"dataDeAtualizacao"`
}
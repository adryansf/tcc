package entity

import (
	"tcc/internal/types"

	"github.com/google/uuid"
)

type AddressEntity struct {
	ID                uuid.UUID     `gorm:"type:uuid;primaryKey;column:id;default:;" json:"id,omitempty"`
	Logradouro        string        `gorm:"column:logradouro" json:"logradouro"`
	Numero            string        `gorm:"column:numero" json:"numero"`
	Bairro            string        `gorm:"column:bairro" json:"bairro"`
	Cidade            string        `gorm:"column:cidade" json:"cidade"`
	UF                string        `gorm:"column:uf" json:"uf"`
	Complemento       *string       `gorm:"column:complemento" json:"complemento,omitempty"`
	CEP               string        `gorm:"column:cep" json:"cep"`
	IDCliente         *uuid.UUID    `gorm:"type:uuid;column:idCliente" json:"-"`
	DataDeCriacao     types.CustomTime `gorm:"column:dataDeCriacao;default:;" json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime `gorm:"column:dataDeAtualizacao;default:;" json:"dataDeAtualizacao"`
}

func (AddressEntity) TableName() string {
	return "Endereco"
}
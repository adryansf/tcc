package entity

import (
	"tcc/internal/modules/account/enum"
	branch "tcc/internal/modules/branch/entity"
	client "tcc/internal/modules/client/entity"

	"tcc/internal/types"

	"github.com/google/uuid"
)

type AccountEntity struct {
	ID                uuid.UUID             `gorm:"type:uuid;primaryKey;column:id;default:;" json:"id,omitempty"`
	Numero            int                   `gorm:"column:numero;default:;" json:"numero"`
	Saldo             *float64              `gorm:"column:saldo;default:;" json:"saldo,omitempty"`
	Tipo              enum.AccountTypeEnum  `gorm:"column:tipo" json:"tipo"`
	IDAgencia         *uuid.UUID            `gorm:"type:uuid;column:idAgencia" json:"idAgencia,omitempty"`
	IDCliente         *uuid.UUID            `gorm:"type:uuid;column:idCliente" json:"idCliente,omitempty"`
	DataDeCriacao     types.CustomTime      `gorm:"column:dataDeCriacao;default:;" json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime      `gorm:"column:dataDeAtualizacao;default:;" json:"dataDeAtualizacao"`

	Cliente           *client.ClientEntity  `gorm:"foreignKey:IDCliente;references:ID" json:"cliente,omitempty"`
	Agencia           *branch.BranchEntity  `gorm:"foreignKey:IDAgencia;references:ID" json:"agencia,omitempty"`
}

func (AccountEntity) TableName() string {
	return "Conta"
}
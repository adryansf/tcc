package entity

import (
	"tcc/internal/modules/account/entity"
	"tcc/internal/modules/transaction/enum"
	"tcc/internal/types"

	"github.com/google/uuid"
)

type TransactionEntity struct {
	ID                uuid.UUID         	    `gorm:"type:uuid;primaryKey;column:id;default:;" json:"id"`
	Valor             float64               `gorm:"column:valor" json:"valor"`
	Tipo              enum.TransactionTypeEnum `gorm:"column:tipo" json:"tipo"`
	IDContaOrigem     *uuid.UUID            `gorm:"type:uuid;column:idContaOrigem" json:"idContaOrigem,omitempty"`
	IDContaDestino    *uuid.UUID            `gorm:"type:uuid;column:idContaDestino" json:"idContaDestino,omitempty"`
	DataDeCriacao     types.CustomTime      `gorm:"column:dataDeCriacao;default:;" json:"dataDeCriacao"`
	ContaOrigem       *entity.AccountEntity `gorm:"foreignKey:IDContaOrigem;references:ID" json:"contaOrigem,omitempty"`
	ContaDestino      *entity.AccountEntity `gorm:"foreignKey:IDContaDestino;references:ID" json:"contaDestino,omitempty"`
}

func (TransactionEntity) TableName() string {
	return "Transacao"
}
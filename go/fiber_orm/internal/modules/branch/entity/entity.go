package entity

import (
	"tcc/internal/types"

	"github.com/google/uuid"
)

type BranchEntity struct {
	ID                uuid.UUID     `gorm:"type:uuid;primaryKey;column:id;default:;" json:"id"`
	Nome              string        `gorm:"column:nome" json:"nome"`
	Numero            int           `gorm:"column:numero" json:"numero"`
	Telefone          string        `gorm:"column:telefone" json:"telefone"`
	DataDeCriacao     types.CustomTime `gorm:"column:dataDeCriacao;default:;" json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime `gorm:"column:dataDeAtualizacao;default:;" json:"dataDeAtualizacao"`
}

func (BranchEntity) TableName() string {
	return "Agencia"
}
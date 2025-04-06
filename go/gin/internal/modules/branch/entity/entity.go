package entity

import (
	"tcc/internal/types"
)

type BranchEntity struct {
	ID              string    `json:"id"`
	Nome            string    `json:"nome"`
	Numero          int       `json:"numero"`
	Telefone        string    `json:"telefone"`
	DataDeCriacao   types.CustomTime `json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime `json:"dataDeAtualizacao"`
}
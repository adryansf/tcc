package entity

import (
	"encoding/json"
	"tcc/internal/modules/account/entity"
	"tcc/internal/modules/transaction/enum"

	"github.com/google/uuid"
)

type TransactionEntity struct {
	ID             uuid.UUID													`json:"id"`
	Valor          float64														`json:"valor"`
	Tipo           enum.TransactionTypeEnum						`json:"tipo"`
	IDContaOrigem  *uuid.UUID													`json:"idContaOrigem,omitempty"`
	IDContaDestino *uuid.UUID													`json:"idContaDestino,omitempty"`
	DataDeCriacao  string															`json:"dataDeCriacao"`
	ContaOrigem    *entity.AccountEntity							`json:"contaOrigem,omitempty"`
	ContaDestino   *entity.AccountEntity							`json:"contaDestino,omitempty"`
}

func ParseConta(contaJSON string) *entity.AccountEntity {
	var conta entity.AccountEntity
	if contaJSON != "" {
		json.Unmarshal([]byte(contaJSON), &conta)
	}
	return &conta
}
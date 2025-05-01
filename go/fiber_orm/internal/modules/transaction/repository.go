package transaction

import (
	"tcc/internal/database"
	"tcc/internal/modules/transaction/entity"
	"tcc/internal/modules/transaction/enum"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ICreateTransactionData struct {
	Tipo          enum.TransactionTypeEnum
	Valor         float64
	IDContaOrigem *uuid.UUID
	IDContaDestino *uuid.UUID
}

type TransactionsRepository struct {
}

func (r *TransactionsRepository) Create(data ICreateTransactionData, tx *gorm.DB) (*entity.TransactionEntity, error) {
	transaction := &entity.TransactionEntity{
		Tipo: data.Tipo,
		Valor: data.Valor,
		IDContaOrigem: data.IDContaOrigem,
		IDContaDestino: data.IDContaDestino,
	}

	result := tx.Create(transaction)
	if result.Error != nil {
		return nil, result.Error
	}

	return transaction, nil
}

func (r *TransactionsRepository) FindAll(idConta string) ([]*entity.TransactionEntity, error) {
	var transactions []*entity.TransactionEntity
	
	result := database.Conn.
		Preload("ContaOrigem", func(db *gorm.DB) *gorm.DB {
			return db.Omit("saldo")
		}).
		Preload("ContaDestino", func(db *gorm.DB) *gorm.DB {
			return db.Omit("saldo")
		}).
		Preload("ContaOrigem.Cliente").
		Preload("ContaOrigem.Agencia").
		Preload("ContaDestino.Cliente").
		Preload("ContaDestino.Agencia").
		Where("\"idContaOrigem\" = ? OR \"idContaDestino\" = ?", idConta, idConta).
		Order("\"dataDeCriacao\" DESC").
		Find(&transactions)

	if result.Error != nil {
		return nil, result.Error
	}

	return transactions, nil
}

package account

import (
	"log"
	"tcc/internal/database"
	"tcc/internal/modules/account/entity"
	"tcc/internal/modules/account/enum"

	"github.com/google/uuid"
	"gorm.io/gorm"
)


type ICreateAccountData struct {
	Tipo      enum.AccountTypeEnum
	IDAgencia *uuid.UUID
	IDCliente uuid.UUID
}

type IQueryFindAllAccounts struct {
	CPF string
}

type IAccountRepository interface {
	Create(data ICreateAccountData) (*entity.AccountEntity, error)
	FindById(id string, join bool) (*entity.AccountEntity, error)
	AddBalance(id string, value float64) error
	RemoveBalance(id string, value float64) error
	FindAll(query IQueryFindAllAccounts) ([]entity.AccountEntity, error)
	Delete(id string) error
}

type AccountRepository struct{
}

func (r *AccountRepository) Create(data ICreateAccountData) (*entity.AccountEntity, error) {
	account := &entity.AccountEntity{Tipo: data.Tipo, IDAgencia: data.IDAgencia, IDCliente: &data.IDCliente}
	var result = database.Conn.Create(account)

	if result.Error != nil {
		return nil, result.Error
	}

	return account, nil
}

func (r *AccountRepository) FindAll(query IQueryFindAllAccounts) ([]*entity.AccountEntity, error) {
	var accounts []*entity.AccountEntity

	err := database.Conn.
		Omit("\"Conta\".\"saldo\"").
		Preload("Cliente").
		Preload("Agencia").
		Joins("JOIN \"Cliente\" ON \"Conta\".\"idCliente\" = \"Cliente\".\"id\"").
		Where("\"Cliente\".\"cpf\" = ?", query.CPF).
		Find(&accounts).Error

	if err != nil {
		log.Printf("Erro ao buscar todas as contas: %v", err)
		return nil, err
	}

	return accounts, nil
}

func (r *AccountRepository) FindById(id string, join bool) (*entity.AccountEntity, error) {
	var account entity.AccountEntity
	query := database.Conn

	if join {
		query = query.Preload("Cliente").Preload("Agencia")
	}

	err := query.First(&account, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	return &account, nil
}

func (r *AccountRepository) AddBalance(id string, value float64, tx *gorm.DB) error {
	return tx.Model(&entity.AccountEntity{}).
		Where("id = ?", id).
		Update("saldo", gorm.Expr("saldo + ?", value)).Error
}

func (r *AccountRepository) RemoveBalance(id string, value float64, tx *gorm.DB) error {
	return tx.Model(&entity.AccountEntity{}).
		Where("id = ?", id).
		Update("saldo", gorm.Expr("saldo - ?", value)).Error
}
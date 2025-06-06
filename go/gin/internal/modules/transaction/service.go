package transaction

import (
	"context"
	"log"
	r "tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/database"
	repository "tcc/internal/modules/account"
	account "tcc/internal/modules/account/entity"
	"tcc/internal/modules/transaction/dto"
	"tcc/internal/modules/transaction/entity"
	"tcc/internal/modules/transaction/enum"
	"time"
)

type TransactionService struct{
	repository struct{
		account repository.AccountRepository
		transaction TransactionsRepository
	}
}

func (s *TransactionService) Create(data dto.CreateTransactionDto, idClient string) (*entity.TransactionEntity, *errors.BaseError) {
	
	var tipo = data.Tipo
	var originAccount *account.AccountEntity = nil

	if data.IDContaDestino == data.IDContaOrigem {
		return nil, errors.BadRequestError(messages.ErrorMessages.Account.BadRequest.SameAccount)
	}

	
	// Verificar se contas existem
	if data.IDContaOrigem != nil {
		originAccount, _ = s.repository.account.FindById(*data.IDContaOrigem, false)
	
		if originAccount == nil {
			return nil, errors.NotFoundError(messages.ErrorMessages.Account.NotFoundOrigin)
		}

		if originAccount.IDCliente.String() != idClient {
			return nil, errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
		}
	}

	if data.IDContaDestino != nil {
		targetAccount, _ := s.repository.account.FindById(*data.IDContaDestino, false)

		if targetAccount == nil {
			return nil, errors.NotFoundError(messages.ErrorMessages.Account.NotFoundTarget)
		}
	}


	if (tipo == enum.TRANSFER || tipo == enum.WITHDRAWAL) && (originAccount != nil && *originAccount.Saldo < data.Valor) {
		return nil, errors.BadRequestError(messages.ErrorMessages.Account.BadRequest.BalanceNotEnough)
	}


	// Iniciar transação
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	tx, err := database.Conn.Begin(ctx)

	if err != nil {
		return nil, errors.InternalServerError(messages.ErrorMessages.InternalServer)
	}

	defer func() {
		if err != nil {
			log.Println("Rollback da transação")
			tx.Rollback(ctx)
		}
	}()

	switch tipo {
		case enum.DEPOSIT:
			s.repository.account.AddBalance(*data.IDContaDestino, data.Valor, tx)
		case enum.TRANSFER:
			s.repository.account.RemoveBalance(*data.IDContaOrigem, data.Valor, tx)
			s.repository.account.AddBalance(*data.IDContaDestino, data.Valor, tx)
		case enum.WITHDRAWAL:
			s.repository.account.RemoveBalance(*data.IDContaOrigem, data.Valor, tx)
	}

	newTransaction, err := s.repository.transaction.Create(ICreateTransactionData{
		Tipo: tipo,
		Valor: data.Valor,
		IDContaOrigem: data.IDContaOrigem,
		IDContaDestino: data.IDContaDestino,
	}, tx)
	if err != nil {
		tx.Rollback(ctx)
		return nil, errors.InternalServerError(messages.ErrorMessages.InternalServer)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, errors.InternalServerError(messages.ErrorMessages.InternalServer)
	}

	return newTransaction, nil
}

func (s *TransactionService) FindAll(idAccount string, idClient string, role r.RoleEnum) ([]*entity.TransactionEntity, *errors.BaseError) {
	permission := helper.HasPermission(role, r.MANAGER)

	account, _ := s.repository.account.FindById(idAccount, false)

	if account == nil {
		return nil, errors.NotFoundError(messages.ErrorMessages.Account.NotFound)
	}

	if account.IDCliente.String() != idClient && !permission {
		return nil, errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
	}

	transactions, _ := s.repository.transaction.FindAll(idAccount)

	if transactions == nil {
		return []*entity.TransactionEntity{}, nil
	}

	return transactions, nil
}
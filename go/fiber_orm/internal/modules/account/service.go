package account

import (
	"tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/account/dto"
	"tcc/internal/modules/account/entity"
	auth "tcc/internal/modules/auth/interfaces"
	"tcc/internal/modules/branch"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/google/uuid"
)

type AccountService struct{
	repository struct{
		account AccountRepository
		client client.ClientRepository
		branch branch.BranchRepository
		manager manager.ManagerRepository
	}
}

func (s *AccountService) Create(data dto.CreateAccountDto, idClient string, payload auth.JwtPayload) (*entity.AccountEntity, *errors.BaseError) {
	if payload.Role == enum.MANAGER{
		manager, _ := s.repository.manager.FindByEmail(payload.Email)
		data.IdAgencia = &manager.IDAgencia
	}

	if data.IdAgencia == nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Account.BadRequest.BranchRequired)
	}

	branch, _ := s.repository.branch.FindById(data.IdAgencia.String())

	if branch == nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Account.BadRequest.BranchNotExists)
	}

	if payload.Role == enum.MANAGER{
		if data.IdCliente == nil{
			return nil, errors.BadRequestError(messages.ErrorMessages.Account.BadRequest.IdClient)
		}

		client, _ := s.repository.client.FindById(data.IdCliente.String())


		if client == nil {
			return nil, errors.BadRequestError(messages.ErrorMessages.Client.NotFound)
		}

		idClient = client.ID.String()
	}

	newAccount, _ := s.repository.account.Create(ICreateAccountData{
		Tipo: data.Tipo,
		IDAgencia: data.IdAgencia,
		IDCliente: uuid.MustParse(idClient),
	})


	if newAccount == nil {
		return nil, errors.InternalServerError(messages.ErrorMessages.InternalServer)
	}

	return newAccount, nil
}

func (s *AccountService) FindAll(cpf string) ([]*entity.AccountEntity, *errors.BaseError) {
	accounts, _ := s.repository.account.FindAll(IQueryFindAllAccounts{
		CPF: cpf,
	})
	if accounts == nil {
		return []*entity.AccountEntity{}, nil
	}
	return accounts, nil
}

func (s *AccountService) FindById(id string, idClient string, role enum.RoleEnum) (*entity.AccountEntity, *errors.BaseError) {
	permission := helper.HasPermission(role, enum.MANAGER)

	account, _ := s.repository.account.FindById(id, true)

	if account == nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Account.NotFound)
	}

	if account.IDCliente.String() != idClient && !permission {
		return nil, errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
	}


	return account, nil
}

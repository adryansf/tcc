package client

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/client/entity"
)

type ClientService struct{
	repository ClientRepository
}

func (s *ClientService) Create(data ICreateClientData) (*entity.ClientEntity, *errors.BaseError) {
	existsEmail, _ := s.repository.FindByEmail(data.Email)
	if existsEmail != nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Client.BadRequest.EmailNotUnique)
	}

	existsCPF, _ := s.repository.FindByCPF(data.CPF)
	if existsCPF != nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Client.BadRequest.CPFNotUnique)
	}

	encryptedPass, _ := helper.EncryptPassword(data.Senha)

	data.Senha = encryptedPass

	client, _ := s.repository.Create(data)
	if client == nil {
		return nil, errors.InternalServerError(messages.ErrorMessages.InternalServer)
	}

	return client, nil
}

func (s *ClientService) FindByCPF(cpf string) (*entity.ClientEntity, *errors.BaseError) {
	client, err := s.repository.FindByCPF(cpf)
	if err != nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Client.NotFound)
	}
	return client, nil
}

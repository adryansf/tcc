package address

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/messages"
	"tcc/internal/modules/address/dto"
	"tcc/internal/modules/address/entity"
	"tcc/internal/modules/client"
)

type AddressService struct{
	repository struct{
		client client.ClientRepository
		address AddressRepository
	}
}

func (s *AddressService) Create(data dto.CreateAddressDto, idClient string) (*entity.AddressEntity, *errors.BaseError) {
	client, _ := s.repository.client.FindById(idClient)
	if client == nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Client.NotFound)
	}

	existsAddress, _ := s.repository.address.FindByIdClient(idClient)

	if existsAddress != nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Address.BadRequest.AlreadyExists)
	}

	newAddress, _ := s.repository.address.Create(ICreateAddressData{
		Logradouro: data.Logradouro,
		Numero: data.Numero,
		Bairro: data.Bairro,
		Cidade: data.Cidade,
		UF: data.Uf,
		CEP: data.Cep,
		IDCliente: idClient,
		Complemento: data.Complemento,
	})

	if newAddress == nil {
		return nil, errors.InternalServerError(messages.ErrorMessages.InternalServer)
	}

	return newAddress, nil
}
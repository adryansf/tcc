package address

import (
	"tcc/internal/database"
	"tcc/internal/modules/address/entity"

	"github.com/google/uuid"
)

type ICreateAddressData struct {
	Logradouro  string
	Numero      string
	Bairro      string
	Cidade      string
	UF          string
	CEP         string
	IDCliente   uuid.UUID
	Complemento string
}

type IAddressRepository interface {
	Create(data ICreateAddressData) (*entity.AddressEntity, error)
	FindByIdClient(idClient string) (*entity.AddressEntity, error)
	FindAll() ([]*entity.AddressEntity, error)
}

type AddressRepository struct {
}

func (r *AddressRepository) Create(data ICreateAddressData) (*entity.AddressEntity, error) {	
	address := &entity.AddressEntity{
		Logradouro:  data.Logradouro,
		Numero:      data.Numero,
		Bairro:      data.Bairro,
		Cidade:      data.Cidade,
		UF:          data.UF,
		CEP:         data.CEP,
		IDCliente:   &data.IDCliente,
		Complemento: &data.Complemento,
	}

	result := database.Conn.Create(address);

	if result.Error != nil {
		return nil, result.Error
	}

	return address, nil
}

func (r *AddressRepository) FindByIdClient(idClient string) (*entity.AddressEntity, error) {
	var address entity.AddressEntity
	result := database.Conn.Find(&address, "\"idCliente\" = ?", idClient)

	if result.Error != nil {
		return nil, result.Error
	}

	return &address, nil
}


package address

import (
	"database/sql"
	"tcc/internal/modules/address/entity"
)

type ICreateAddressData struct {
	Logradouro  string
	Numero      string
	Bairro      string
	Cidade      string
	UF          string
	CEP         string
	IDCliente   string
	Complemento string
}

type IAddressRepository interface {
	Create(data ICreateAddressData) (*entity.AddressEntity, error)
	FindByIdClient(idClient string) (*entity.AddressEntity, error)
	FindAll() ([]*entity.AddressEntity, error)
}

type AddressRepository struct {
	db *sql.DB
}

func (r *AddressRepository) Create(data ICreateAddressData) (*entity.AddressEntity, error) {
	query := `INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
	row := r.db.QueryRow(query, data.Logradouro, data.Numero, data.Bairro, data.Cidade, data.UF, data.CEP, data.IDCliente, data.Complemento)

	var address entity.AddressEntity
	err := row.Scan(&address.ID, &address.Logradouro, &address.Numero, &address.Bairro, &address.Cidade, &address.UF, &address.Complemento, &address.CEP, &address.IDCliente, &address.DataDeCriacao, &address.DataDeAtualizacao)
	if err != nil {
		return nil, err
	}

	return &address, nil
}

func (r *AddressRepository) FindByIdClient(idClient string) (*entity.AddressEntity, error) {
	query := `SELECT * FROM "Endereco" e WHERE e."idCliente" = $1`
	row := r.db.QueryRow(query, idClient)

	var address entity.AddressEntity
	err := row.Scan(&address.ID, &address.Logradouro, &address.Numero, &address.Bairro, &address.Cidade, &address.UF, &address.Complemento, &address.CEP, &address.IDCliente, &address.DataDeCriacao, &address.DataDeAtualizacao)
	if err != nil {
		return nil, err
	}

	return &address, nil
}


package address

import (
	"context"
	"log"
	"tcc/internal/database"
	"tcc/internal/modules/address/entity"
	"time"
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
}

func (r *AddressRepository) Create(data ICreateAddressData) (*entity.AddressEntity, error) {
	query := `INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
	
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	// Iniciar a transação
	tx, err := database.Conn.Begin(ctx)
	if err != nil {
		log.Printf("erro ao iniciar transação: %v", err)
		return nil, err
	}

	// Em caso de erro, faz rollback
	defer func() {
		if err != nil {
			log.Println("Rollback da transação")
			tx.Rollback(ctx)
		}
	}()

	row := tx.QueryRow(ctx, query, data.Logradouro, data.Numero, data.Bairro, data.Cidade, data.UF, data.CEP, data.IDCliente, data.Complemento)
	
	var address entity.AddressEntity
	err = row.Scan(&address.ID, &address.Logradouro, &address.Numero, &address.Bairro, &address.Cidade, &address.UF, &address.Complemento, &address.CEP, &address.IDCliente, &address.DataDeCriacao, &address.DataDeAtualizacao)

	if err != nil {
		log.Printf("erro ao inserir endereço: %v", err)
		return nil, err
	}
	
	err = tx.Commit(ctx)

	if err != nil {
		log.Printf("erro ao commitar transação: %v", err)
		return nil, err
	}

	return &address, nil
}

func (r *AddressRepository) FindByIdClient(idClient string) (*entity.AddressEntity, error) {
	query := `SELECT * FROM "Endereco" e WHERE e."idCliente" = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	row := database.Conn.QueryRow(ctx, query, idClient)

	var address entity.AddressEntity
	err := row.Scan(&address.ID, &address.Logradouro, &address.Numero, &address.Bairro, &address.Cidade, &address.UF, &address.Complemento, &address.CEP, &address.IDCliente, &address.DataDeCriacao, &address.DataDeAtualizacao)
	if err != nil {
		return nil, err
	}

	return &address, nil
}


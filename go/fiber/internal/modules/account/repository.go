package account

import (
	"database/sql"
	"log" // Adicionado para logging
	"tcc/internal/modules/account/entity"
	"time"
)


type Agencia struct {
	ID               string    `json:"id"`
	Nome             string    `json:"nome"`
	Numero           string    `json:"numero"`
	Telefone         string    `json:"telefone"`
	DataDeCriacao    time.Time `json:"dataDeCriacao"`
	DataDeAtualizacao time.Time `json:"dataDeAtualizacao"`
}

type ICreateAccountData struct {
	Tipo      string
	IDAgencia string
	IDCliente string
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
	db *sql.DB
}

func (r *AccountRepository) Create(data ICreateAccountData) (*entity.AccountEntity, error) {
	var account entity.AccountEntity
	err := r.db.QueryRow(
		`INSERT INTO "Conta" (tipo, "idAgencia", "idCliente") VALUES ($1, $2, $3) RETURNING *`,
		data.Tipo, data.IDAgencia, data.IDCliente,
	).Scan(&account.ID, &account.Numero, &account.Saldo, &account.Tipo, &account.IDAgencia, &account.IDCliente, &account.DataDeCriacao, &account.DataDeAtualizacao)
	if err != nil {
		log.Printf("Erro ao criar conta: %v", err)
		return nil, err
	}
	return &account, nil
}

func (r *AccountRepository) FindAll(query IQueryFindAllAccounts) ([]*entity.AccountEntity, error) {
	var agencia sql.NullString
	var cliente sql.NullString
	rows, err := r.db.Query(
		`SELECT 
        c.id AS id,
        c.numero AS numero,
        c.tipo AS tipo,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" as "dataDeAtualizacao",
        json_build_object(
          'id', cli.id,
          'nome', cli.nome,
          'cpf', cli.cpf,
					'dataDeNascimento', cli."dataDeNascimento",
          'telefone', cli.telefone,
          'email', cli.email,
          'dataDeCriacao', cli."dataDeCriacao",
          'dataDeAtualizacao', cli."dataDeAtualizacao"
        ) AS cliente,
        json_build_object(
          'id', a.id,
          'nome', a.nome,
          'numero', a.numero,
          'telefone', a.telefone,
          'dataDeCriacao', a."dataDeCriacao",
          'dataDeAtualizacao', a."dataDeAtualizacao"
        ) AS agencia
      FROM "Conta" c
      JOIN "Cliente" cli ON c."idCliente" = cli.id
      JOIN "Agencia" a ON c."idAgencia" = a.id
      WHERE cli.cpf = $1`,
		query.CPF,
	)
	if err != nil {
		log.Printf("Erro ao buscar todas as contas: %v", err)
		return nil, err
	}
	defer rows.Close()

	var accounts []*entity.AccountEntity
	for rows.Next() {
		var account entity.AccountEntity
		err := rows.Scan(&account.ID, &account.Numero, &account.Tipo, &account.DataDeCriacao, &account.DataDeAtualizacao, &cliente, &agencia)
		if err != nil {
			log.Printf("Erro ao escanear conta: %v", err)
			return nil, err
		}

		if cliente.Valid {
			account.Cliente = entity.ParseCliente(cliente.String)
		}

		if agencia.Valid {
			account.Agencia = entity.ParseAgencia(agencia.String)
		}

		accounts = append(accounts, &account)
	}
	return accounts, nil
}

func (r *AccountRepository) FindById(id string, join bool) (*entity.AccountEntity, error) {
	query := `SELECT 
        c.id AS id,
        c.numero AS numero,
        c.saldo AS saldo,
        c.tipo AS tipo,
        c."idAgencia" AS "idAgencia",
        c."idCliente" AS "idCliente",
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" as "dataDeAtualizacao"`
	if join {
		query += `,json_build_object(
          'id', cli.id,
          'nome', cli.nome,
          'cpf', cli.cpf,
					'dataDeNascimento', cli."dataDeNascimento",
          'telefone', cli.telefone,
          'email', cli.email,
          'dataDeCriacao', cli."dataDeCriacao",
          'dataDeAtualizacao', cli."dataDeAtualizacao"
        ) AS cliente,
        json_build_object(
          'id', a.id,
          'nome', a.nome,
          'numero', a.numero,
          'telefone', a.telefone,
          'dataDeCriacao', a."dataDeCriacao",
          'dataDeAtualizacao', a."dataDeAtualizacao"
        ) AS agencia`
	}
	query += ` FROM "Conta" c`
	if join {
		query += ` JOIN "Cliente" cli ON c."idCliente" = cli.id
      JOIN "Agencia" a ON c."idAgencia" = a.id`
	}
	query += ` WHERE c.id = $1 LIMIT 1`

	var account entity.AccountEntity
	var cliente sql.NullString
	var agencia sql.NullString
	var err error
	if join {
		err = r.db.QueryRow(query, id).Scan(&account.ID, &account.Numero, &account.Saldo, &account.Tipo, &account.IDAgencia, &account.IDCliente, &account.DataDeCriacao, &account.DataDeAtualizacao, &cliente, &agencia)
	} else {
		err = r.db.QueryRow(query, id).Scan(&account.ID, &account.Numero, &account.Saldo, &account.Tipo, &account.IDAgencia, &account.IDCliente, &account.DataDeCriacao, &account.DataDeAtualizacao)
	}
	if err != nil {
		log.Printf("Erro ao buscar conta por ID: %v", err)
		return nil, err
	}

	if cliente.Valid {
		account.Cliente = entity.ParseCliente(cliente.String)
	}

	if agencia.Valid {
		account.Agencia = entity.ParseAgencia(agencia.String)
	}

	return &account, nil
}

func (r *AccountRepository) AddBalance(tx *sql.Tx,id string, value float64) error {
	_, err := r.db.Exec(
		`UPDATE "Conta"
      SET saldo = saldo + $1
      WHERE id = $2`,
		value, id,
	)
	if err != nil {
		log.Printf("Erro ao adicionar saldo: %v", err)
	}
	return err
}

func (r *AccountRepository) RemoveBalance(tx *sql.Tx, id string, value float64) error {
	_, err := r.db.Exec(
		`UPDATE "Conta"
      SET saldo = saldo - $1
      WHERE id = $2`,
		value, id,
	)
	if err != nil {
		log.Printf("Erro ao remover saldo: %v", err)
	}
	return err
}

func (r *AccountRepository) Delete(id string) error {
	_, err := r.db.Exec(
		`DELETE FROM "Conta"
      WHERE id = $1`,
		id,
	)
	if err != nil {
		log.Printf("Erro ao deletar conta: %v", err)
	}
	return err
}


func NewAccountRepository (db *sql.DB) AccountRepository{
	return AccountRepository{
		db: db,
	}
}

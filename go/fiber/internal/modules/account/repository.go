package account

import (
	"context"
	"database/sql"
	"log"
	"tcc/internal/database"
	"tcc/internal/modules/account/entity"
	"time"

	"github.com/jackc/pgx/v5"
)


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
}

func (r *AccountRepository) Create(data ICreateAccountData) (*entity.AccountEntity, error) {
	var account entity.AccountEntity
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

	row := tx.QueryRow(ctx,
		`INSERT INTO "Conta" (tipo, "idAgencia", "idCliente") VALUES ($1, $2, $3) RETURNING *`,
		data.Tipo, data.IDAgencia, data.IDCliente,
	)

	err = row.Scan(&account.ID, &account.Numero, &account.Saldo, &account.Tipo, &account.IDAgencia, &account.IDCliente, &account.DataDeCriacao, &account.DataDeAtualizacao)
	if err != nil {
		log.Printf("Erro ao criar conta: %v", err)
		return nil, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		log.Printf("erro ao commitar transação: %v", err)
		return nil, err
	}
	
	return &account, nil
}

func (r *AccountRepository) FindAll(query IQueryFindAllAccounts) ([]*entity.AccountEntity, error) {
	var agencia sql.NullString
	var cliente sql.NullString

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	rows, err := database.Conn.Query(ctx,
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

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	if join {
		err = database.Conn.QueryRow(ctx,query, id).Scan(&account.ID, &account.Numero, &account.Saldo, &account.Tipo, &account.IDAgencia, &account.IDCliente, &account.DataDeCriacao, &account.DataDeAtualizacao, &cliente, &agencia)
	} else {
		err = database.Conn.QueryRow(ctx,query, id).Scan(&account.ID, &account.Numero, &account.Saldo, &account.Tipo, &account.IDAgencia, &account.IDCliente, &account.DataDeCriacao, &account.DataDeAtualizacao)
	}
	if err != nil {
		// log.Printf("Erro ao buscar conta por ID: %v", err)
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

func (r *AccountRepository) AddBalance(id string, value float64, tx pgx.Tx) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	_, err := tx.Exec(ctx,
		`UPDATE "Conta"
      SET saldo = saldo + $1
      WHERE id = $2`,
		value, id,
	)
	if err != nil {
		log.Printf("Erro ao adicionar saldo: %v", err)
	}
}

func (r *AccountRepository) RemoveBalance(id string, value float64, tx pgx.Tx) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	_, err := tx.Exec(ctx,
		`UPDATE "Conta"
      SET saldo = saldo - $1
      WHERE id = $2`,
		value, id,
	)
	if err != nil {
		log.Printf("Erro ao remover saldo: %v", err)
	}
}

func (r *AccountRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	_, err := database.Conn.Exec(ctx,
		`DELETE FROM "Conta"
      WHERE id = $1`,
		id,
	)
	if err != nil {
		log.Printf("Erro ao deletar conta: %v", err)
	}
	return err
}
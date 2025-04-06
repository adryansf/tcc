package client

import (
	"context"
	"database/sql"
	"log"
	"tcc/internal/database"
	"tcc/internal/modules/client/entity"
	"time"
)

type ICreateClientData struct {
	Nome            string
	CPF             string
	Telefone        string
	DataDeNascimento string
	Email           string
	Senha           string
}

type ClientRepository struct{
}

func (r *ClientRepository) Create(data ICreateClientData) (*entity.ClientEntity, error) {
  var dataDeNascimento time.Time
	var client entity.ClientEntity
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

	row := tx.QueryRow(ctx, `
		INSERT INTO "Cliente" (nome, cpf, telefone, "dataDeNascimento", email, senha)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, nome, cpf, telefone, "dataDeNascimento", email, senha, "dataDeCriacao", "dataDeAtualizacao"
	`, data.Nome, data.CPF, data.Telefone, data.DataDeNascimento, data.Email, data.Senha)

  err = row.Scan(
		&client.ID, &client.Nome, &client.CPF, &client.Telefone, &dataDeNascimento, &client.Email, &client.Senha, &client.DataDeCriacao, &client.DataDeAtualizacao)
  
  if err != nil {
    log.Printf("erro ao criar cliente: %v", err)
    return nil, err
  }

  client.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

  err = tx.Commit(ctx)

	if err != nil {
		log.Printf("erro ao commitar transação: %v", err)
		return nil, err
	}
	
	return &client, nil
}

func (r *ClientRepository) FindById(id string) (*entity.ClientEntity, error) {
	var client entity.ClientEntity
	var endereco sql.NullString
  var dataDeNascimento time.Time

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	err := database.Conn.QueryRow(ctx,`
		SELECT 
        c.id, 
        c.nome AS nome,
        c.cpf as cpf,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao",
        CASE 
          WHEN e.id IS NOT NULL THEN 
            json_build_object(
              'logradouro', e.logradouro,
              'numero', e.numero,
              'bairro', e.bairro,
              'cidade', e.cidade,
              'uf', e.uf,
              'complemento', e.complemento,
              'cep', e.cep,
              'dataDeCriacao', e."dataDeCriacao",
              'dataDeAtualizacao', e."dataDeAtualizacao"
              ) 
          ELSE NULL 
        END AS endereco 
      FROM "Cliente" c
      LEFT JOIN "Endereco" e ON e."idCliente" = c.id
      WHERE c.id = $1 LIMIT 1
	`, id).Scan(&client.ID, &client.Nome, &client.CPF, &client.Telefone, &dataDeNascimento, &client.Email, &client.Senha, &client.DataDeCriacao, &client.DataDeAtualizacao, &endereco)
	
	if err != nil {
    // log.Printf("erro: %v", err)
		return nil, err
	}

  client.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

	if endereco.Valid {
		client.Endereco = entity.ParseEndereco(endereco.String)
	}
	return &client, nil
}

func (r *ClientRepository) FindByCPF(cpf string) (*entity.ClientEntity, error) {
	var client entity.ClientEntity
	var endereco sql.NullString
  var dataDeNascimento time.Time
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	err := database.Conn.QueryRow(ctx,`
		SELECT 
        c.id, 
        c.nome AS nome,
        c.cpf as cpf,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao",
        CASE 
          WHEN e.id IS NOT NULL THEN 
            json_build_object(
              'logradouro', e.logradouro,
              'numero', e.numero,
              'bairro', e.bairro,
              'cidade', e.cidade,
              'uf', e.uf,
              'complemento', e.complemento,
              'cep', e.cep,
              'dataDeCriacao', e."dataDeCriacao",
              'dataDeAtualizacao', e."dataDeAtualizacao"
              ) 
          ELSE NULL 
        END AS endereco 
      FROM "Cliente" c
      LEFT JOIN "Endereco" e ON e."idCliente" = c.id
      WHERE c.cpf = $1 LIMIT 1
	`, cpf).Scan(&client.ID, &client.Nome, &client.CPF, &client.Telefone, &dataDeNascimento, &client.Email, &client.Senha, &client.DataDeCriacao, &client.DataDeAtualizacao, &endereco)
	
  if err != nil {
    // log.Printf("erro: %v", err)
		return nil, err
	}

  client.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

	if endereco.Valid {
		client.Endereco = entity.ParseEndereco(endereco.String)
	}

	return &client, nil
}

func (r *ClientRepository) FindByEmail(email string) (*entity.ClientEntity, error) {
	var client entity.ClientEntity
	var endereco sql.NullString
  var dataDeNascimento time.Time

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	err := database.Conn.QueryRow(ctx,`
		SELECT 
        c.id, 
        c.nome AS nome,
        c.cpf as cpf,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao",
        CASE 
          WHEN e.id IS NOT NULL THEN 
            json_build_object(
              'logradouro', e.logradouro,
              'numero', e.numero,
              'bairro', e.bairro,
              'cidade', e.cidade,
              'uf', e.uf,
              'complemento', e.complemento,
              'cep', e.cep,
              'dataDeCriacao', e."dataDeCriacao",
              'dataDeAtualizacao', e."dataDeAtualizacao"
              ) 
          ELSE NULL 
        END AS endereco 
      FROM "Cliente" c
      LEFT JOIN "Endereco" e ON e."idCliente" = c.id
      WHERE c.email = $1 LIMIT 1
	`, email).Scan(&client.ID, &client.Nome, &client.CPF, &client.Telefone, &dataDeNascimento, &client.Email, &client.Senha, &client.DataDeCriacao, &client.DataDeAtualizacao, &endereco)
	if err != nil {
		return nil, err
	}

  client.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

	if endereco.Valid {
		client.Endereco = entity.ParseEndereco(endereco.String)
	}
	return &client, nil
}

func (r *ClientRepository) FindAll(quantidade int) ([]*entity.ClientEntity, error) {
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	rows, err := database.Conn.Query(ctx,
		`SELECT 
        c.id, 
        c.nome AS nome,
        c.cpf as cpf,
        c.telefone AS telefone,
        c."dataDeNascimento" AS "dataDeNascimento",
        c.email AS email,
        c.senha AS senha,
        c."dataDeCriacao" AS "dataDeCriacao",
        c."dataDeAtualizacao" AS "dataDeAtualizacao"
      FROM "Cliente" c
      LIMIT $1`,
		quantidade,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []*entity.ClientEntity
	for rows.Next() {
		var client entity.ClientEntity
    var dataDeNascimento time.Time
		err := rows.Scan(&client.ID, &client.Nome, &client.CPF, &client.Telefone, &dataDeNascimento, &client.Email, &client.Senha, &client.DataDeCriacao, &client.DataDeAtualizacao)
		if err != nil {
      log.Printf("%v", err)
			return nil, err
		}

    client.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

		clients = append(clients, &client)
	}
	return clients, nil
}
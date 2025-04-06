package branch

import (
	"context"
	"log" // Adicionado para log de erros
	"tcc/internal/database"
	"tcc/internal/modules/branch/entity"
	"time"
)

type BranchRepository struct {
}

func (r *BranchRepository) FindById(id string) (*entity.BranchEntity, error) {
	query := `SELECT * FROM "Agencia" a WHERE a.id = $1 LIMIT 1`
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	row := database.Conn.QueryRow(ctx, query, id)

	var branch entity.BranchEntity
	err := row.Scan(&branch.ID, &branch.Nome, &branch.Telefone, &branch.Numero, &branch.DataDeCriacao, &branch.DataDeAtualizacao)
	if err != nil {
		log.Printf("Erro ao buscar agência por ID: %v", err) // Log de erro
		return nil, err
	}

	return &branch, nil
}

func (r *BranchRepository) FindAll() ([]*entity.BranchEntity, error) {
	query := `SELECT * FROM "Agencia"`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	rows, err := database.Conn.Query(ctx, query)
	if err != nil {
		log.Printf("Erro ao buscar agências: %v", err) // Log de erro
		return nil, err
	}
	defer rows.Close()

	var branches []*entity.BranchEntity
	for rows.Next() {
		var branch entity.BranchEntity
		err := rows.Scan(&branch.ID, &branch.Nome, &branch.Telefone, &branch.Numero, &branch.DataDeCriacao, &branch.DataDeAtualizacao)
		if err != nil {
			log.Printf("Erro ao escanear agências: %v", err) // Log de erro
			return nil, err
		}
		branches = append(branches, &branch)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Erro ao iterar sobre as linhas: %v", err) // Log de erro
		return nil, err
	}

	return branches, nil
}
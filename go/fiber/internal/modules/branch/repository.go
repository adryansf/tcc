package branch

import (
	"database/sql"
	"log" // Adicionado para log de erros
	"tcc/internal/modules/branch/entity"
)

type BranchRepository struct {
	db *sql.DB
}

func (r *BranchRepository) FindById(id string) (*entity.BranchEntity, error) {
	query := `SELECT * FROM "Agencia" a WHERE a.id = $1 LIMIT 1`
	row := r.db.QueryRow(query, id)

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
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var branches []*entity.BranchEntity
	for rows.Next() {
		var branch entity.BranchEntity
		err := rows.Scan(&branch.ID, &branch.Nome, &branch.Telefone, &branch.Numero, &branch.DataDeCriacao, &branch.DataDeAtualizacao)
		if err != nil {
			log.Printf("Erro ao escanear agência: %v", err) // Log de erro
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

func NewBranchRepository (db *sql.DB) BranchRepository{
	return BranchRepository{
		db: db,
	}
}
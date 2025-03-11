package manager

import (
	"database/sql"
	"tcc/internal/modules/manager/entity"
	"time"
)

type ManagerRepository struct {
	db *sql.DB
}

func NewManagerRepository(db *sql.DB) ManagerRepository {
	return ManagerRepository{db: db}
}

func (r *ManagerRepository) FindByEmail(email string) (*entity.ManagerEntity, error) {
	query := `SELECT * FROM "Gerente" WHERE email = $1 LIMIT 1`
	row := r.db.QueryRow(query, email)

	var manager entity.ManagerEntity
	var dataDeNascimento time.Time
	err := row.Scan(
		&manager.ID,
		&manager.IDAgencia,
		&manager.Nome,
		&manager.CPF,
		&manager.Telefone,
		 &dataDeNascimento,
		&manager.Email,
		&manager.Senha,
		&manager.DataDeCriacao,
		&manager.DataDeAtualizacao,
	)

	if err != nil {
		return nil, err
	}

	manager.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

	return &manager, nil
}


func (r *ManagerRepository) FindAll(quantidade int) ([]*entity.ManagerEntity, error) {
	rows, err := r.db.Query(
		`SELECT * FROM "Gerente" LIMIT $1`,
		quantidade,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var managers []*entity.ManagerEntity
	for rows.Next() {
		var manager entity.ManagerEntity
    var dataDeNascimento time.Time
		err := rows.Scan(
			&manager.ID,
			&manager.IDAgencia,
			&manager.Nome,
			&manager.CPF,
			&manager.Telefone,
			&dataDeNascimento,
			&manager.Email,
			&manager.Senha,
			&manager.DataDeCriacao,
			&manager.DataDeAtualizacao,
		)
		if err != nil {
			return nil, err
		}

		manager.DataDeNascimento = dataDeNascimento.Format(time.DateOnly)

		managers = append(managers, &manager)
	}
	return managers, nil
}
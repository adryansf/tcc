package manager

import (
	"context"
	"tcc/internal/database"
	"tcc/internal/modules/manager/entity"
	"time"
)

type ManagerRepository struct {
}

func (r *ManagerRepository) FindByEmail(email string) (*entity.ManagerEntity, error) {
	query := `SELECT * FROM "Gerente" WHERE email = $1 LIMIT 1`
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	row := database.Conn.QueryRow(ctx, query, email)

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
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	rows, err := database.Conn.Query(ctx,
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
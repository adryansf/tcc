package branch

import (

	// Adicionado para log de erros
	"tcc/internal/database"
	"tcc/internal/modules/branch/entity"
)

type BranchRepository struct {
}

func (r *BranchRepository) FindById(id string) (*entity.BranchEntity, error) {
	var branch entity.BranchEntity;

	result := database.Conn.Find(&branch, "id = ?", id)

	if result.Error != nil {
		return nil, result.Error
	}

	return &branch, nil
}

func (r *BranchRepository) FindAll() ([]*entity.BranchEntity, error) {
	var branches []*entity.BranchEntity;

	result := database.Conn.Find(&branches)
	
	if result.Error != nil {
		return nil, result.Error
	}

	return branches, nil
}
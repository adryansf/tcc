package manager

import (
	"tcc/internal/database"
	"tcc/internal/modules/manager/entity"
)

type ManagerRepository struct {
}

func (r *ManagerRepository) FindByEmail(email string) (*entity.ManagerEntity, error) {

	var manager entity.ManagerEntity
	result := database.Conn.Where("email = ?", email).First(&manager)

	if result.Error != nil {
		return nil, result.Error
	}

	return &manager, nil
}


func (r *ManagerRepository) FindAll(quantidade int) ([]*entity.ManagerEntity, error) {

	var managers []*entity.ManagerEntity
	result := database.Conn.Limit(quantidade).Find(&managers)

	if result.Error != nil {
		return nil, result.Error
	}

	return managers, nil
}
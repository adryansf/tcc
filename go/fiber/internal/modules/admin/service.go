package admin

import (
	"tcc/internal/common/errors"
	"tcc/internal/modules/client"
	c "tcc/internal/modules/client/entity"
	"tcc/internal/modules/manager"
	m "tcc/internal/modules/manager/entity"
)

type AdminService struct{
	repository struct{
		client client.ClientRepository
		manager manager.ManagerRepository
	}
}


func (s *AdminService) FindAllClients(quantidade int) ([]*c.ClientEntity, *errors.BaseError) {
	clients, _ := s.repository.client.FindAll(quantidade)

	if clients == nil {
		return []*c.ClientEntity{}, nil
	}
	return clients, nil
}

func (s *AdminService) FindAllManagers(quantidade int) ([]*m.ManagerEntity, *errors.BaseError) {
	managers, _ := s.repository.manager.FindAll(quantidade)

	if managers == nil {
		return []*m.ManagerEntity{}, nil
	}
	return managers, nil
}
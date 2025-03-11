package branch

import (
	"tcc/internal/common/errors"
	"tcc/internal/modules/branch/entity"
)

type BranchService struct{
	repository BranchRepository
}

func (s *BranchService) FindAll() ([]*entity.BranchEntity, *errors.BaseError) {
	branchs, err := s.repository.FindAll()

	if err != nil {
		return []*entity.BranchEntity{}, nil
	}

	return branchs, nil
}
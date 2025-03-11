package auth

import (
	"tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/auth/dto"
	auth "tcc/internal/modules/auth/interfaces"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"
	"time"
)

type AuthService struct{
	repository struct{
		client client.ClientRepository
		manager manager.ManagerRepository
	}
}

func (s *AuthService) LoginClient(data dto.LoginAuthDto) (*dto.LoginAuthClientOutputDto, *errors.BaseError) {
	client, _ := s.repository.client.FindByEmail(data.Email)
	if client == nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Auth.BadRequest)
	}

	if !(helper.IsPasswordCorrect(data.Senha, client.Senha)) {
		return nil, errors.BadRequestError(messages.ErrorMessages.Auth.BadRequest)
	}

	token, _ := helper.GenerateJWT(auth.JwtPayload{
		ID: client.ID.String(),
		Email: client.Email,
		CPF: client.CPF,
		Role: enum.RoleEnum(enum.CLIENT),	
	})

	return &dto.LoginAuthClientOutputDto{
		Token: token.Token,
		Usuario: *client,
		ExpiraEm: token.ExpiresIn.Format(time.RFC3339),
	}, nil
}

func (s *AuthService) LoginManager(data dto.LoginAuthDto) (*dto.LoginAuthManagerOutputDto, *errors.BaseError) {
	manager, _ := s.repository.manager.FindByEmail(data.Email)
	if manager == nil {
		return nil, errors.BadRequestError(messages.ErrorMessages.Auth.BadRequest)
	}

	if !(helper.IsPasswordCorrect(data.Senha, manager.Senha)) {
		return nil, errors.BadRequestError(messages.ErrorMessages.Auth.BadRequest)
	}

	token, _ := helper.GenerateJWT(auth.JwtPayload{
		ID: manager.ID.String(),
		Email: manager.Email,
		CPF: manager.CPF,
		Role: enum.RoleEnum(enum.MANAGER),	
	})

	return &dto.LoginAuthManagerOutputDto{
		Token: token.Token,
		Usuario: *manager,
		ExpiraEm: token.ExpiresIn.Format(time.RFC3339),
	}, nil
}
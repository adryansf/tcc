package auth

import (
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gofiber/fiber/v2"
)

func AuthModule(router *fiber.App) {
	service := AuthService{
		repository: struct{
			client client.ClientRepository
			manager manager.ManagerRepository
			}{
			client: client.ClientRepository{},
			manager: manager.ManagerRepository{},
		},
	}
	controller := AuthController{
		service: service,
	}

	group := router.Group("/auth")
	{
		group.Post("/login/clientes", controller.LoginClient)
		group.Post("/login/gerentes", controller.LoginManager)
	}
}

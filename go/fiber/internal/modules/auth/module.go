package auth

import (
	"database/sql"

	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gofiber/fiber/v2"
)

func AuthModule(router *fiber.App, db *sql.DB) {
	clientRepository := client.NewClientRepository(db)
	managerRepository := manager.NewManagerRepository(db)

	service := AuthService{
		repository: struct{
			client client.ClientRepository
			manager manager.ManagerRepository
			}{
			client: clientRepository,
			manager: managerRepository,
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

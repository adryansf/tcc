package admin

import (
	"database/sql"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gofiber/fiber/v2"
)

func AdminModule(router *fiber.App, db *sql.DB) {
	clientRepository := client.NewClientRepository(db)
	managerRepository := manager.NewManagerRepository(db)

	service := AdminService{
		repository: struct{client client.ClientRepository; manager manager.ManagerRepository}{
			client: clientRepository,
			manager: managerRepository,
		},
	} 
	controller := AdminController{
		service: service,
	}

	group := router.Group("/admin")
	{
		group.Get("/clientes", controller.FindAllClients)
		group.Get("/gerentes", controller.FindAllManagers)
	}
}
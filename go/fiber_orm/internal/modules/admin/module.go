package admin

import (
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gofiber/fiber/v2"
)

func AdminModule(router *fiber.App) {
	service := AdminService{
		repository: struct{client client.ClientRepository; manager manager.ManagerRepository}{
			client: client.ClientRepository{},
			manager: manager.ManagerRepository{},
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
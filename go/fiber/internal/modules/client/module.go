package client

import (
	"tcc/internal/common/enum"
	"tcc/internal/common/middleware"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func ClientModule(router *fiber.App) {
	repository := ClientRepository{}
	service := ClientService{
		repository: repository,
	}
	controller := ClientController{
		service: service,
	}

	group := router.Group("/clientes")
	{
		group.Get("/cpf/:cpf", auth.AuthMiddleware(), middleware.RolesPermittedMiddleware(enum.MANAGER), controller.FindByCPF)
		group.Post("", controller.Create)
	}
}

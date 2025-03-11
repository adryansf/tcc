package client

import (
	"database/sql"
	"tcc/internal/common/enum"
	"tcc/internal/common/middleware"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func ClientModule(router *fiber.App, db *sql.DB) {
	repository := ClientRepository{
		db: db,
	}
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

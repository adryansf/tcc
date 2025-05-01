package account

import (
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/branch"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gofiber/fiber/v2"
)

func AccountModule(router *fiber.App) {
	service := AccountService{
		repository: struct{account AccountRepository; client client.ClientRepository; branch branch.BranchRepository; manager manager.ManagerRepository}{
			account: AccountRepository{},
			client: client.ClientRepository{},
			branch: branch.BranchRepository{},
			manager: manager.ManagerRepository{},
		},
	}
	controller := AccountController{
		service: service,
	}

	group := router.Group("/contas")
	{
		group.Get("", auth.AuthMiddleware(), controller.FindAll)
		group.Post("", auth.AuthMiddleware(), controller.Create)
		group.Get("/:id", auth.AuthMiddleware(), controller.FindByCPF)
	}
}
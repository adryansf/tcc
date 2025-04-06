package account

import (
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/branch"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gin-gonic/gin"
)

func AccountModule(router *gin.Engine) {
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
		group.GET("", auth.AuthMiddleware(), controller.FindAll)
		group.POST("", auth.AuthMiddleware(), controller.Create)
		group.GET("/:id", auth.AuthMiddleware(), controller.FindByCPF)
	}
}
package account

import (
	"database/sql"
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/branch"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gin-gonic/gin"
)

func AccountModule(router *gin.Engine, db *sql.DB) {
	accountRepository := AccountRepository{
		db: db,
	}
	clientRepository := client.NewClientRepository(db)
	branchRepository := branch.NewBranchRepository(db)
	managerRepository := manager.NewManagerRepository(db)


	service := AccountService{
		repository: struct{account AccountRepository; client client.ClientRepository; branch branch.BranchRepository; manager manager.ManagerRepository}{
			account: accountRepository,
			client: clientRepository,
			branch: branchRepository,
			manager: managerRepository,
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
package auth

import (
	"database/sql"

	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gin-gonic/gin"
)

func AuthModule(router *gin.Engine, db *sql.DB) {
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
		group.POST("/login/clientes", controller.LoginClient)
		group.POST("/login/gerentes", controller.LoginManager)
	}
}

package auth

import (
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gin-gonic/gin"
)

func AuthModule(router *gin.Engine) {
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
		group.POST("/login/clientes", controller.LoginClient)
		group.POST("/login/gerentes", controller.LoginManager)
	}
}

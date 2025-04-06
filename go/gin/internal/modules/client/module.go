package client

import (
	"tcc/internal/common/enum"
	"tcc/internal/common/middleware"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gin-gonic/gin"
)

func ClientModule(router *gin.Engine) {
	service := ClientService{
		repository: ClientRepository{},
	}
	controller := ClientController{
		service: service,
	}

	group := router.Group("/clientes")
	{
		group.GET("/cpf/:cpf", auth.AuthMiddleware(), middleware.RolesPermittedMiddleware(enum.MANAGER),controller.FindByCPF)
		group.POST("",controller.Create)
	}
}

package client

import (
	"database/sql"
	"tcc/internal/common/enum"
	"tcc/internal/common/middleware"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gin-gonic/gin"
)

func ClientModule(router *gin.Engine, db *sql.DB) {
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
		group.GET("/cpf/:cpf", auth.AuthMiddleware(), middleware.RolesPermittedMiddleware(enum.MANAGER),controller.FindByCPF)
		group.POST("",controller.Create)
	}
}

package admin

import (
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gin-gonic/gin"
)

func AdminModule(router *gin.Engine) {
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
		group.GET("/clientes", controller.FindAllClients)
		group.GET("/gerentes", controller.FindAllManagers)
	}
}
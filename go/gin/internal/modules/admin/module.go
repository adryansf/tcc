package admin

import (
	"database/sql"
	"tcc/internal/modules/client"
	"tcc/internal/modules/manager"

	"github.com/gin-gonic/gin"
)

func AdminModule(router *gin.Engine, db *sql.DB) {
	clientRepository := client.NewClientRepository(db)
	managerRepository := manager.NewManagerRepository(db)


	service := AdminService{
		repository: struct{client client.ClientRepository; manager manager.ManagerRepository}{
			client: clientRepository,
			manager: managerRepository,
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
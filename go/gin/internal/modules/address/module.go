package address

import (
	"database/sql"
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/client"

	"github.com/gin-gonic/gin"
)

func AddressModule(router *gin.Engine, db *sql.DB) {
	clientRepository := client.NewClientRepository(db)
	addressRepository := AddressRepository{
		db: db,
	}
	service := AddressService{
		repository: struct{client client.ClientRepository; address AddressRepository}{
			client: clientRepository,
			address: addressRepository,
		},
	}
	controller := AddressController{
		service: service,
	}

	group := router.Group("/enderecos")
	{
		group.POST("", auth.AuthMiddleware(),controller.Create)
	}
}

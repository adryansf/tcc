package address

import (
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/client"

	"github.com/gin-gonic/gin"
)

func AddressModule(router *gin.Engine) {
	service := AddressService{
		repository: struct{client client.ClientRepository; address AddressRepository}{
			client: client.ClientRepository{},
			address: AddressRepository{},
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

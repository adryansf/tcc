package address

import (
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/client"

	"github.com/gofiber/fiber/v2"
)

func AddressModule(router *fiber.App) {
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
		group.Post("", auth.AuthMiddleware(), controller.Create)
	}
}

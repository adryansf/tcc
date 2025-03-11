package address

import (
	"database/sql"
	auth "tcc/internal/modules/auth/middleware"
	"tcc/internal/modules/client"

	"github.com/gofiber/fiber/v2"
)

func AddressModule(router *fiber.App, db *sql.DB) {
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
		group.Post("", auth.AuthMiddleware(), controller.Create)
	}
}

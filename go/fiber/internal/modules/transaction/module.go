package transaction

import (
	"tcc/internal/modules/account"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func TransactionModule(router *fiber.App) {
	service := TransactionService{
		repository: struct{account account.AccountRepository; transaction TransactionsRepository}{
			account: account.AccountRepository{},
			transaction: TransactionsRepository{},
		},
	}
	controller := TransactionController{
		service: service,
	}

	group := router.Group("/transacoes")
	{
		group.Get("", auth.AuthMiddleware(), controller.FindAll)
		group.Post("", auth.AuthMiddleware(), controller.Create)
	}
}
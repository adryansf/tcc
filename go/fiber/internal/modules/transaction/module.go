package transaction

import (
	"database/sql"
	"tcc/internal/modules/account"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func TransactionModule(router *fiber.App, db *sql.DB) {
	accountRepository := account.NewAccountRepository(db)
	transactionRepository := TransactionsRepository{
		db: db,
	}

	service := TransactionService{
		repository: struct{account account.AccountRepository; transaction TransactionsRepository}{
			account: accountRepository,
			transaction: transactionRepository,
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
package transaction

import (
	"database/sql"
	"tcc/internal/modules/account"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gin-gonic/gin"
)

func TransactionModule(router *gin.Engine, db *sql.DB) {
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
		group.GET("", auth.AuthMiddleware(), controller.FindAll)
		group.POST("", auth.AuthMiddleware(), controller.Create)
	}
}
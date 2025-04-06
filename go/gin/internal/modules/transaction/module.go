package transaction

import (
	"tcc/internal/modules/account"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gin-gonic/gin"
)

func TransactionModule(router *gin.Engine) {
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
		group.GET("", auth.AuthMiddleware(), controller.FindAll)
		group.POST("", auth.AuthMiddleware(), controller.Create)
	}
}
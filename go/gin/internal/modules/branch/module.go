package branch

import (
	"database/sql"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gin-gonic/gin"
)

func BranchModule(router *gin.Engine, db *sql.DB) {
	repository := BranchRepository{
		db: db,
	}
	service := BranchService{
		repository: repository,
	}
	controller := BranchController{
		service: service,
	}

	group := router.Group("/agencias")
	{
		group.GET("", auth.AuthMiddleware(), controller.FindAll)
	}
}
package branch

import (
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gin-gonic/gin"
)

func BranchModule(router *gin.Engine) {
	service := BranchService{
		repository: BranchRepository{},
	}
	controller := BranchController{
		service: service,
	}

	group := router.Group("/agencias")
	{
		group.GET("", auth.AuthMiddleware(), controller.FindAll)
	}
}
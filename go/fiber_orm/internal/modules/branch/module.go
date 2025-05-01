package branch

import (
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func BranchModule(router *fiber.App) {
	controller := BranchController{
		service: BranchService{
			repository: BranchRepository{},
		},
	}

	group := router.Group("/agencias")
	{
		group.Get("", auth.AuthMiddleware(), controller.FindAll)
	}
}
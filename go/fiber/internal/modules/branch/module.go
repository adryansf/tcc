package branch

import (
	"database/sql"
	auth "tcc/internal/modules/auth/middleware"

	"github.com/gofiber/fiber/v2"
)

func BranchModule(router *fiber.App, db *sql.DB) {
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
		group.Get("", auth.AuthMiddleware(), controller.FindAll)
	}
}
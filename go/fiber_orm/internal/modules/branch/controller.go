package branch

import (
	"github.com/gofiber/fiber/v2"
)

type BranchController struct{
	service BranchService
}

func (c *BranchController) FindAll(ctx *fiber.Ctx) error {
	branchs, err := c.service.FindAll()

	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(branchs)
}
package admin

import (
	"strconv"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/admin/dto"

	"github.com/gofiber/fiber/v2"
)

type AdminController struct{
	service AdminService
}

func (c *AdminController) FindAllManagers(ctx *fiber.Ctx) error {
	quantidade := ctx.Query("quantidade")

	quantidadeInt, _ := strconv.Atoi(quantidade)

	dto := dto.FindAllQueryDto{
		Quantidade: quantidadeInt,
	}

	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	managers, err := c.service.FindAllManagers(dto.Quantidade)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(managers)
}

func (c *AdminController) FindAllClients(ctx *fiber.Ctx) error {
	quantidade := ctx.Query("quantidade")

	quantidadeInt, _ := strconv.Atoi(quantidade)

	dto := dto.FindAllQueryDto{
		Quantidade: quantidadeInt,
	}

	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	clients, err := c.service.FindAllClients(dto.Quantidade)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(clients)
}
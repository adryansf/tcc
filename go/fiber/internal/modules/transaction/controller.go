package transaction

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/transaction/dto"

	"github.com/gofiber/fiber/v2"
)

type TransactionController struct{
	service TransactionService
}

func (c *TransactionController) FindAll(ctx *fiber.Ctx) error {
	idConta := ctx.Query("idConta")
	
	auth := helper.GetAuth(ctx)

	dto := dto.FindAllQueryTransactionsDto{
		IDConta: &idConta,
	}

	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	transactions, err := c.service.FindAll(*dto.IDConta, auth.ID, auth.Role)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(transactions)
}

func (c *TransactionController) Create(ctx *fiber.Ctx) error {
	auth := helper.GetAuth(ctx)

	var dto dto.CreateTransactionDto
	if err := ctx.BodyParser(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}
	
	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	_, err := c.service.Create(dto, auth.ID)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusCreated).Send(nil)
}
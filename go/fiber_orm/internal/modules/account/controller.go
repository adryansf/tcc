package account

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/account/dto"

	"github.com/gofiber/fiber/v2"
)

type AccountController struct{
	service AccountService
}

func (c *AccountController) FindAll(ctx *fiber.Ctx) error {
	cpf := ctx.Query("cpf")

	dto := dto.FindAllQueryAccountDto{
		CPF: cpf,
	}

	// Transformações Necessárias
	dto.Transform()

	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	client, err := c.service.FindAll(dto.CPF)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(client)
}

func (c *AccountController) Create(ctx *fiber.Ctx) error {
	auth := helper.GetAuth(ctx)

	var dto dto.CreateAccountDto
	if err := ctx.BodyParser(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}
	
	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	_, err := c.service.Create(dto, auth.ID, *auth)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusCreated).Send(nil)
}

func (c *AccountController) FindByCPF(ctx *fiber.Ctx) error {
	id := ctx.Params("id")

	auth := helper.GetAuth(ctx)

	dto := dto.FindOneAccountDto{
		ID: id,
	}

	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	account, err := c.service.FindById(id, auth.ID, auth.Role)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	// Omitindo Campos não necessários
	account.IDAgencia = nil
	account.IDCliente = nil

	return ctx.Status(fiber.StatusOK).JSON(account)
}
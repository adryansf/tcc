package client

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/client/dto"

	"github.com/gofiber/fiber/v2"
)

type ClientController struct{
	service ClientService
}

func (c *ClientController) Create(ctx *fiber.Ctx) error {
	var dto dto.CreateClientDto
	if err := ctx.BodyParser(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	// Transformações Necessárias
	dto.Transform()
	
	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	_, err := c.service.Create(ICreateClientData{
		Nome:            dto.Nome,
		CPF:             dto.CPF,
		Telefone:        dto.Telefone,
		DataDeNascimento: dto.DataDeNascimento,
		Email:           dto.Email,
		Senha:           dto.Senha,
	})
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusCreated).Send(nil)
}

func (c *ClientController) FindByCPF(ctx *fiber.Ctx) error {
	cpf := ctx.Params("cpf")

	dto := dto.FindByCPFClientDto{
		CPF: cpf,
	}

	// Transformações Necessárias
	dto.Transform()

	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	client, err := c.service.FindByCPF(dto.CPF)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(client)
}
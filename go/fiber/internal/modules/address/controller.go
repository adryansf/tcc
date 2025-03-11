package address

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/address/dto"

	"github.com/gofiber/fiber/v2"
)

type AddressController struct{
	service AddressService
}

func (c *AddressController) Create(ctx *fiber.Ctx) error {
	auth := helper.GetAuth(ctx)

	var dto dto.CreateAddressDto
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

	_, err := c.service.Create(dto, auth.ID)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusCreated).Send(nil)
}
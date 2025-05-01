package auth

import (
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/auth/dto"

	"github.com/gofiber/fiber/v2"
)

type AuthController struct{
	service AuthService
}

func (c *AuthController) LoginClient(ctx *fiber.Ctx) error {
	var dto dto.LoginAuthDto
	if err := ctx.BodyParser(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}
	
	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	response, err := c.service.LoginClient(dto)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(response)
}

func (c *AuthController) LoginManager(ctx *fiber.Ctx) error {
	var dto dto.LoginAuthDto
	if err := ctx.BodyParser(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}
	
	if err := helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		return ctx.Status(badRequest.StatusCode).JSON(badRequest)
	}

	response, err := c.service.LoginManager(dto)
	if err != nil {
		return ctx.Status(err.StatusCode).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(response)
}
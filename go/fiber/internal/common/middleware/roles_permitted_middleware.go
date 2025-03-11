package middleware

import (
	"tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/messages"
	auth "tcc/internal/modules/auth/interfaces"

	"github.com/gofiber/fiber/v2"
)

func RolesPermittedMiddleware(rolesPermitted ...enum.RoleEnum) fiber.Handler {
	return func(c *fiber.Ctx) error {
		jwtPayload := c.Locals("auth")
		if jwtPayload == nil {
			error := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			return c.Status(error.StatusCode).JSON(error)
		}

		payload, ok := jwtPayload.(auth.JwtPayload)
		if !ok || !contains(rolesPermitted, payload.Role) {
			error := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			return c.Status(error.StatusCode).JSON(error)
		}

		return c.Next()
	}
}

func contains(roles []enum.RoleEnum, role enum.RoleEnum) bool {
	for _, r := range roles {
		if r == role {
			return true
		}
	}
	return false
}

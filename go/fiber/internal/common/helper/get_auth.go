package helper

import (
	auth "tcc/internal/modules/auth/interfaces"

	"github.com/gofiber/fiber/v2"
)

func GetAuth(c *fiber.Ctx) *auth.JwtPayload {
	jwtPayload := c.Locals("auth")

	if jwtPayload == nil {
		return nil
	}
	payload, _ := jwtPayload.(auth.JwtPayload)

	return &payload
}
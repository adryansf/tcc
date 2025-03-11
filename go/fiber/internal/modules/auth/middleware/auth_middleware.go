package auth

import (
	"os"
	"strings"
	"tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/messages"
	auth "tcc/internal/modules/auth/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var SECRET = []byte(os.Getenv("JWT_SECRET"))

func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			unauthorized := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			return c.Status(unauthorized.StatusCode).JSON(unauthorized)
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			badRequest := errors.BadRequestError(messages.ErrorMessages.Middleware.Auth.BadRequest.Unformatted)
			return c.Status(badRequest.StatusCode).JSON(badRequest)
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return SECRET, nil
		})

		if err != nil || !token.Valid {
			unauthorized := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			return c.Status(unauthorized.StatusCode).JSON(unauthorized)
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			unauthorized := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			return c.Status(unauthorized.StatusCode).JSON(unauthorized)
		}

		c.Locals("auth", auth.JwtPayload{
			CPF:  claims["cpf"].(string),
			Role: enum.RoleEnum(claims["role"].(string)),
			ID: claims["id"].(string),
			Email: claims["email"].(string),
		})
		return c.Next()
	}
}

package auth

import (
	"os"
	"strings"
	"tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/messages"
	auth "tcc/internal/modules/auth/interfaces"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var SECRET = []byte(os.Getenv("JWT_SECRET"))

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
      unauthorized := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			c.JSON(unauthorized.StatusCode, unauthorized)
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
      badRequest := errors.BadRequestError(messages.ErrorMessages.Middleware.Auth.BadRequest.Unformatted)
			c.JSON(badRequest.StatusCode, badRequest)
			c.Abort()
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return SECRET, nil
		})

		if err != nil || !token.Valid {
      unauthorized := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			c.JSON(unauthorized.StatusCode, unauthorized)
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
      unauthorized := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			c.JSON(unauthorized.StatusCode, unauthorized)
			c.Abort()
			return
		}

		c.Set("auth", auth.JwtPayload{
			CPF:  claims["cpf"].(string),
			Role: enum.RoleEnum(claims["role"].(string)),
			ID: claims["id"].(string),
			Email: claims["email"].(string),
		})
		c.Next()
	}
}

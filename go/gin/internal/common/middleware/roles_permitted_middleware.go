package middleware

import (
	"tcc/internal/common/enum"
	"tcc/internal/common/errors"
	"tcc/internal/common/messages"
	auth "tcc/internal/modules/auth/interfaces"

	"github.com/gin-gonic/gin"
)

func RolesPermittedMiddleware(rolesPermitted ...enum.RoleEnum) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtPayload, exists := c.Get("auth")
		if !exists {
			error := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			c.JSON(error.StatusCode, error)
			c.Abort()
			return
		}

		payload, ok := jwtPayload.(auth.JwtPayload)
		if (!ok || !contains(rolesPermitted, payload.Role)) {
			error := errors.UnauthorizedError(messages.ErrorMessages.Unauthorized)
			c.JSON(error.StatusCode, error)
			c.Abort()
			return
		}

		c.Next()
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

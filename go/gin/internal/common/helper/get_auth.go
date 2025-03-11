package helper

import (
	auth "tcc/internal/modules/auth/interfaces"

	"github.com/gin-gonic/gin"
)

func GetAuth(c *gin.Context) *auth.JwtPayload {
	jwtPayload, exists := c.Get("auth")

	if !exists {
		return nil
	}
	payload, _ := jwtPayload.(auth.JwtPayload)

	return &payload
}
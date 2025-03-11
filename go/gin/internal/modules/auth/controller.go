package auth

import (
	"net/http"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/auth/dto"

	"github.com/gin-gonic/gin"
)

type AuthController struct{
	service AuthService
}


func (c *AuthController) LoginClient(ctx *gin.Context){
	var dto dto.LoginAuthDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		ctx.JSON(badRequest.StatusCode, badRequest)
		return
	}
	
	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	response, err := c.service.LoginClient(dto)

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (c *AuthController) LoginManager(ctx *gin.Context){
	var dto dto.LoginAuthDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		ctx.JSON(badRequest.StatusCode, badRequest)
		return
	}
	
	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	response, err := c.service.LoginManager(dto)

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, response)
}
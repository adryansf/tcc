package account

import (
	"net/http"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/account/dto"

	"github.com/gin-gonic/gin"
)

type AccountController struct{
	service AccountService
}

func (c *AccountController) FindAll(ctx *gin.Context){
	cpf := ctx.Query("cpf")

	dto := dto.FindAllQueryAccountDto{
		CPF: cpf,
	}

	// Transformações Necessárias
	dto.Transform()

	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	client, err := c.service.FindAll(dto.CPF)
	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, client)
}

func (c *AccountController) Create(ctx *gin.Context){
	auth := helper.GetAuth(ctx)

	var dto dto.CreateAccountDto
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


	_, err := c.service.Create(dto, auth.ID, *auth)

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.Status(http.StatusCreated)
}

func (c *AccountController) FindByCPF(ctx *gin.Context) {
	id := ctx.Param("id")

	auth := helper.GetAuth(ctx)

	dto := dto.FindOneAccountDto{
		ID: id,
	}

	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	account, err := c.service.FindById(id, auth.ID, auth.Role)
	
	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	// Omitindo Campos não necessários
	account.IDAgencia = nil
	account.IDCliente = nil

	ctx.JSON(http.StatusOK, account)
}
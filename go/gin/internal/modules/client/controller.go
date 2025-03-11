package client

import (
	"net/http"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/client/dto"

	"github.com/gin-gonic/gin"
)

type ClientController struct{
	service ClientService
}


func (c *ClientController) Create(ctx *gin.Context){
	var dto dto.CreateClientDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err.Error())
		ctx.JSON(badRequest.StatusCode, badRequest)
		return
	}

	// Transformações Necessárias
	dto.Transform()
	
	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	_, err := c.service.Create(ICreateClientData{
		Nome:            dto.Nome,
		CPF:             dto.CPF,
		Telefone:        dto.Telefone,
		DataDeNascimento: dto.DataDeNascimento,
		Email:           dto.Email,
		Senha:           dto.Senha,
	})

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.Status(http.StatusCreated)
}

func (c *ClientController) FindByCPF(ctx *gin.Context) {
	cpf := ctx.Param("cpf")

	dto := dto.FindByCPFClientDto{
		CPF: cpf,
	}

	// Transformações Necessárias
	dto.Transform()

	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	client, err := c.service.FindByCPF(dto.CPF)
	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, client)
}
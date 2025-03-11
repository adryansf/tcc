package admin

import (
	"net/http"
	"strconv"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/admin/dto"

	"github.com/gin-gonic/gin"
)

type AdminController struct{
	service AdminService
}

func (c *AdminController) FindAllManagers(ctx *gin.Context){
	quantidade := ctx.Query("quantidade")

	quantidadeInt, _ := strconv.Atoi(quantidade)

	dto := dto.FindAllQueryDto{
		Quantidade: quantidadeInt,
	}

	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	managers, err := c.service.FindAllManagers(dto.Quantidade)
	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, managers)
}

func (c *AdminController) FindAllClients(ctx *gin.Context){
	quantidade := ctx.Query("quantidade")

	quantidadeInt, _ := strconv.Atoi(quantidade)

	dto := dto.FindAllQueryDto{
		Quantidade: quantidadeInt,
	}

	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	clients, err := c.service.FindAllClients(dto.Quantidade)
	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, clients)
}
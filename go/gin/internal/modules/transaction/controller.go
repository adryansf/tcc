package transaction

import (
	"net/http"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/transaction/dto"

	"github.com/gin-gonic/gin"
)

type TransactionController struct{
	service TransactionService
}

func (c *TransactionController) FindAll(ctx *gin.Context){
	idConta := ctx.Query("idConta")
	
	auth := helper.GetAuth(ctx)

	dto := dto.FindAllQueryTransactionsDto{
		IDConta: &idConta,
	}

	if err:= helper.Validate(dto); err != nil {
		badRequest := errors.BadRequestError(messages.ErrorMessages.BadRequest, err...)
		ctx.JSON(badRequest.StatusCode, badRequest)
		return 
	}


	transactions, err := c.service.FindAll(*dto.IDConta, auth.ID, auth.Role)
	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, transactions)
}

func (c *TransactionController) Create(ctx *gin.Context){
	auth := helper.GetAuth(ctx)

	var dto dto.CreateTransactionDto
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


	_, err := c.service.Create(dto, auth.ID)

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.Status(http.StatusCreated)
}
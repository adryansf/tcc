package address

import (
	"net/http"
	"tcc/internal/common/errors"
	"tcc/internal/common/helper"
	"tcc/internal/common/messages"
	"tcc/internal/modules/address/dto"

	"github.com/gin-gonic/gin"
)

type AddressController struct{
	service AddressService
}


func (c *AddressController) Create(ctx *gin.Context){
	auth := helper.GetAuth(ctx)

	var dto dto.CreateAddressDto
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


	_, err := c.service.Create(dto, auth.ID)

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.Status(http.StatusCreated)
}
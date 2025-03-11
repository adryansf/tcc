package branch

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type BranchController struct{
	service BranchService
}

func (c *BranchController) FindAll(ctx *gin.Context){
	branchs, err := c.service.FindAll()

	if err != nil {
		ctx.JSON(err.StatusCode, err)
		return
	}

	ctx.JSON(http.StatusOK, branchs)
}
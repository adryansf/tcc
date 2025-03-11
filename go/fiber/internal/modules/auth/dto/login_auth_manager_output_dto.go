package dto

import (
	"tcc/internal/modules/manager/entity"
)

type LoginAuthManagerOutputDto struct {
	Usuario  entity.ManagerEntity    `json:"usuario"`
	Token    string                   `json:"token"`
	ExpiraEm string                   `json:"expiraEm"`
}

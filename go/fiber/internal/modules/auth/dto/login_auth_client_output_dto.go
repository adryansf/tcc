package dto

import (
	"tcc/internal/modules/client/entity"
)

type LoginAuthClientOutputDto struct {
	Usuario  entity.ClientEntity `json:"usuario"`
	Token    string                `json:"token"`
	ExpiraEm string         `json:"expiraEm"` // seconds
}
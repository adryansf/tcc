package dto

type ParamsAddressDto struct {
	IdClient string `validate:"required,uuid"`
}
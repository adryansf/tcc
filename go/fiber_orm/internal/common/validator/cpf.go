package validator

import (
	v "github.com/go-playground/validator/v10"
	"github.com/klassmann/cpfcnpj"
)

func ValidateCPF(fl v.FieldLevel) bool {
	cpf := fl.Field().String()
	return cpfcnpj.ValidateCPF(cpf)
}
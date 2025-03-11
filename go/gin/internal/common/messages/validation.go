package messages

import (
	"fmt"
	"strconv"

	"tcc/internal/modules/transaction/enum"

	"github.com/go-playground/validator/v10"
)

var ValidationMessages = struct {
	IsEmail     func(string) string
	IsString    func(string) string
	MinLength   func(string, int) string
	IsInt       func(string) string
	IsBoolean   func(string) string
	InvalidCPF  func(string) string
	IsUUID      func(string) string
	IsPositive  func(string) string
	IsDateString func(string) string
	MaxLength   func(string, int) string
	Required func (string) string
	OneOf    func(string, string) string
}{
	Required: func (fieldName string) string {
		return fmt.Sprintf("O campo %s é obrigatório.", fieldName)
	},
	IsEmail: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser um email.", fieldName)
	},
	IsString: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser uma string.", fieldName)
	},
	MinLength: func(fieldName string, minLength int) string {
		return fmt.Sprintf("O campo %s deve ter no mínimo %d caracteres.", fieldName, minLength)
	},
	IsInt: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser um inteiro.", fieldName)
	},
	IsBoolean: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser um valor booleano.", fieldName)
	},
	InvalidCPF: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser um CPF válido.", fieldName)
	},
	IsUUID: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser um UUID.", fieldName)
	},
	IsPositive: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser um valor positivo.", fieldName)
	},
	IsDateString: func(fieldName string) string {
		return fmt.Sprintf("O campo %s deve ser uma data válida.", fieldName)
	},
	MaxLength: func(fieldName string, maxLength int) string {
		return fmt.Sprintf("O campo %s deve ter no máximo %d caracteres.", fieldName, maxLength)
	},
	OneOf: func(fieldName string, validValues string) string {
		return fmt.Sprintf("O campo %s deve ser um dos seguintes valores: %s.", fieldName, validValues)
	},
}

// Função para definir mensagens personalizadas
func GetValidationErrorMessage(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return ValidationMessages.Required(err.Field())
	case "min":
		min, _:= strconv.Atoi(err.Param())
		return  ValidationMessages.MinLength(err.Field(), min)
	case "email":
		return ValidationMessages.IsEmail(err.Field())
	case "uuid":
		return ValidationMessages.IsUUID(err.Field())
	case "cpf":
		return ValidationMessages.InvalidCPF(err.Field())
	case "date_format":
		return ValidationMessages.IsDateString(err.Field())
	case "oneof":
		return ValidationMessages.OneOf(err.Field(), err.Param())
	case "gt":
		return ValidationMessages.IsPositive(err.Field())
	case string(enum.DEPOSIT):
		return "idContaDestino é obrigatório para depósitos."
	case string(enum.WITHDRAWAL):
		return "idContaOrigem é obrigatório para saques."
	case string(enum.TRANSFER):
		return "idContaOrigem e idContaDestino são obrigatórios para transferências."
	default:
		return "Erro de validação desconhecido"
	}
}
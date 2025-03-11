package helper

import (
	"tcc/internal/common/messages"
	"tcc/internal/modules/transaction/dto"

	"tcc/internal/common/validator"

	v "github.com/go-playground/validator/v10"
)

func Validate(c any) []string {
	validate := v.New()

	validate.RegisterValidation("cpf", validator.ValidateCPF)
	validate.RegisterValidation("date_format", validator.ValidateFormattedDate)
	validate.RegisterStructValidation(validator.ValidateTransaction, dto.CreateTransactionDto{})

	err := validate.Struct(c)
	if err != nil {
		var errorsList []string
		for _, err := range err.(v.ValidationErrors) {
			errorsList = append(errorsList, messages.GetValidationErrorMessage(err))
		}
		return errorsList
	}
	return nil
}

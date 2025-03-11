package validator

import (
	"time"

	v "github.com/go-playground/validator/v10"
)

func ValidateFormattedDate (fl v.FieldLevel) bool {
	dateStr := fl.Field().String()

	_, err := time.Parse("2006-01-02", dateStr)
	return err == nil
}
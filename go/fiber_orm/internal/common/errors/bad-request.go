package errors

import (
	"net/http"
)

func BadRequestError(message string, errors ...string) *BaseError {
	return &BaseError{
		Message:    message,
		StatusCode: http.StatusBadRequest,
		Errors:     errors,
	}
}

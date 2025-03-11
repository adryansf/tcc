package errors

import (
	"net/http"
)

func InternalServerError(message string, errors ...string) *BaseError {
	return &BaseError{
		Message:    message,
		StatusCode: http.StatusInternalServerError,
		Errors:     errors,
	}
}

package errors

import (
	"net/http"
)

func UnauthorizedError(message string, errors ...string) *BaseError {
	return &BaseError{
		Message:    message,
		StatusCode: http.StatusUnauthorized,
		Errors:     errors,
	}
}

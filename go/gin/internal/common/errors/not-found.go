package errors

import (
	"net/http"
)

func NotFoundError(message string, errors ...string) *BaseError {
	return &BaseError{
		Message:    message,
		StatusCode: http.StatusNotFound,
		Errors:     errors,
	}
}

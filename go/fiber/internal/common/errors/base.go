package errors

type BaseError struct {
	Message    string   `json:"message"`
	StatusCode int      `json:"statusCode"`
	Errors     []string `json:"errors,omitempty"`
}
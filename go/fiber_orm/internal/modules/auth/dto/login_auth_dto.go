package dto

type LoginAuthDto struct {
	Email string `validate:"required,email" json:"email"`
	Senha string `validate:"required,min=8" json:"senha"`
}
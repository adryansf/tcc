package helper

import (
	"os"
	"strconv"
	"time"

	auth "tcc/internal/modules/auth/interfaces"

	"github.com/golang-jwt/jwt/v5"
)

var SECRET = os.Getenv("JWT_SECRET")
var EXPIRES_IN = os.Getenv("JWT_EXPIRES_IN")

type Return struct {
	Token string
	ExpiresIn time.Time
}

func GenerateJWT(payload auth.JwtPayload) (*Return, error){
	expires_in, err := strconv.Atoi(EXPIRES_IN)

	if err != nil {
		expires_in = 86400
	}

	var exp = time.Now().UTC().Add(time.Second * time.Duration(expires_in))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"cpf": payload.CPF,
		"email": payload.Email,
		"id": payload.ID,
		"role": payload.Role,
		"exp": exp.Unix(),
	})

	tokenString, err := token.SignedString([]byte(SECRET))

	if err != nil {
    return nil, err
	}	

	return &Return{
		Token: tokenString,
		ExpiresIn: exp,
	}, nil
}
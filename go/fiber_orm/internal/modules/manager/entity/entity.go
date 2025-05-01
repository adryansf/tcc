package entity

import (
	"database/sql/driver"
	"encoding/json"
	"tcc/internal/modules/branch/entity"
	"tcc/internal/types"
	"time"

	"github.com/google/uuid"
)

type DateOnly string

func (d *DateOnly) Scan(value interface{}) error {
	if value == nil {
		*d = ""
		return nil
	}

	switch v := value.(type) {
	case time.Time:
		*d = DateOnly(v.Format("2006-01-02"))
	case []byte:
		*d = DateOnly(string(v))
	case string:
		*d = DateOnly(v)
	default:
		return nil
	}
	return nil
}

func (d DateOnly) Value() (driver.Value, error) {
	if d == "" {
		return nil, nil
	}
	return string(d), nil
}

func (d *DateOnly) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return err
	}
	
	*d = DateOnly(t.Format("2006-01-02"))
	return nil
}

func (d DateOnly) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(d))
}


type ManagerEntity struct {
	ID                uuid.UUID             `gorm:"type:uuid;primaryKey;column:id;default:;" json:"id"`
	IDAgencia         uuid.UUID             `gorm:"type:uuid;column:idAgencia" json:"idAgencia"`
	Nome              string                `gorm:"column:nome" json:"nome"`
	CPF               string                `gorm:"column:cpf" json:"cpf"`
	Telefone          string                `gorm:"column:telefone" json:"telefone"`
	DataDeNascimento  DateOnly              `gorm:"column:dataDeNascimento;type:date" json:"dataDeNascimento"`
	Email             string                `gorm:"column:email" json:"email"`
	Senha             string                `gorm:"column:senha" json:"-"`
	DataDeCriacao     types.CustomTime      `gorm:"column:dataDeCriacao;default:;" json:"dataDeCriacao"`
	DataDeAtualizacao types.CustomTime      `gorm:"column:dataDeAtualizacao;default:;" json:"dataDeAtualizacao"`
	Agencia           *entity.BranchEntity  `gorm:"foreignKey:IDAgencia;references:ID" json:"agencia,omitempty"`
}

func (ManagerEntity) TableName() string {
	return "Gerente"
}
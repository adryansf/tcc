package types

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"strings"
	"time"
)

type CustomTime struct {
	time.Time
	Original string
	Valid    bool
}

const outputLayout = "2006-01-02T15:04:05Z"

var acceptedLayouts = []string{
	"2006-01-02T15:04:05.999999",       // microssegundos (sem timezone)
	"2006-01-02T15:04:05.999999Z",      // microssegundos + Z
	"2006-01-02T15:04:05.999999999Z",   // nanosegundos + Z
	time.RFC3339Nano,
	time.RFC3339,
	"2006-01-02 15:04:05.999999",       // fallback sem "T"
	"2006-01-02 15:04:05",
}


func parseFlexibleTime(s string) (time.Time, error) {
	for _, layout := range acceptedLayouts {
		if t, err := time.Parse(layout, s); err == nil {
			return t, nil
		}
	}
	return time.Time{}, errors.New("formato inválido")
}

func (ct *CustomTime) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), "\"")

	if s == "" || s == "null" {
		ct.Valid = false
		ct.Original = ""
		return nil
	}

	// Tenta fazer o parse com múltiplos layouts
	t, err := parseFlexibleTime(s)
	if err != nil {
		ct.Valid = false
		ct.Original = s
		return nil
	}

	// Formata para o layout desejado e armazena no Original
	ct.Time = t
	ct.Valid = true
	ct.Original = t.UTC().Format(outputLayout)
	return nil
}



// MarshalJSON sempre retorna no formato UTC sem milissegundos
func (ct CustomTime) MarshalJSON() ([]byte, error) {
	if ct.Valid {
		return json.Marshal(ct.Time.UTC().Format(outputLayout))
	}

	// Se não for válido, tenta parsear a string original
	t, err := parseFlexibleTime(ct.Original)
	if err == nil {
		return json.Marshal(t.UTC().Format(outputLayout))
	}

	// Último caso: retorna a string original
	return json.Marshal(ct.Original)
}

// Scan lida com dados vindos direto do banco
func (ct *CustomTime) Scan(value interface{}) error {
	if value == nil {
		ct.Valid = false
		return nil
	}

	switch v := value.(type) {
	case time.Time:
		ct.Time = v
		ct.Valid = true
		return nil
	case []byte:
		str := string(v)
		t, err := parseFlexibleTime(str)
		if err != nil {
			ct.Original = str
			ct.Valid = false
			return nil
		}
		ct.Time = t
		ct.Valid = true
		return nil
	case string:
		t, err := parseFlexibleTime(v)
		if err != nil {
			ct.Original = v
			ct.Valid = false
			return nil
		}
		ct.Time = t
		ct.Valid = true
		return nil
	default:
		ct.Valid = false
		return nil
	}
}

func (ct CustomTime) Value() (driver.Value, error) {
	if ct.Valid {
		return ct.Time, nil
	}
	return nil, nil
}

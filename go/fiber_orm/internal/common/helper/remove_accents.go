package helper

import (
	"unicode"

	"golang.org/x/text/unicode/norm"
)

func RemoveAccents(s string) string {
	// Normaliza a string para o formato NFD (Normalization Form Decomposed)
	// e remove os caracteres de acento (diacríticos).
	result := norm.NFD.String(s)
	var runes []rune
	for _, r := range result {
		// Mantém apenas os caracteres que não são diacríticos
		if unicode.Is(unicode.M, r) {
			continue
		}
		runes = append(runes, r)
	}
	return string(runes)
}
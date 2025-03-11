package helper

import "strings"

func CleanDigits(text string) string {
	replacer := strings.NewReplacer("-", "", "_", "", ".", "", "(", "", ")", "", " ", "")
	return replacer.Replace(text)
}

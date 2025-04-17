use unidecode::unidecode;

// Remove acentos de uma string
pub fn remove_accents(input: &str) -> String {
  unidecode(input)
}

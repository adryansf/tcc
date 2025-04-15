/// Remove todos os caracteres não numéricos de uma string
pub fn clean_digits(input: &str) -> String {
  input.chars().filter(|c| c.is_digit(10)).collect()
} 
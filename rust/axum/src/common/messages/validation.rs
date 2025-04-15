pub struct ValidationMessages;

impl ValidationMessages {
    pub fn required(field_name: &str) -> String {
        format!("O campo {} é obrigatório.", field_name)
    }

    pub fn is_email(field_name: &str) -> String {
        format!("O campo {} deve ser um email.", field_name)
    }

    pub fn is_string(field_name: &str) -> String {
        format!("O campo {} deve ser uma string.", field_name)
    }

    pub fn min_length(field_name: &str, min_length: usize) -> String {
        format!("O campo {} deve ter no mínimo {} caracteres.", field_name, min_length)
    }

    pub fn is_int(field_name: &str) -> String {
        format!("O campo {} deve ser um inteiro.", field_name)
    }

    pub fn is_boolean(field_name: &str) -> String {
        format!("O campo {} deve ser um valor booleano.", field_name)
    }

    pub fn invalid_cpf(field_name: &str) -> String {
        format!("O campo {} deve ser um CPF válido.", field_name)
    }

    pub fn is_uuid(field_name: &str) -> String {
        format!("O campo {} deve ser um UUID.", field_name)
    }

    pub fn is_positive(field_name: &str) -> String {
        format!("O campo {} deve ser um valor positivo.", field_name)
    }

    pub fn is_date_string(field_name: &str) -> String {
        format!("O campo {} deve ser uma data válida.", field_name)
    }

    pub fn max_length(field_name: &str, max_length: usize) -> String {
        format!("O campo {} deve ter no máximo {} caracteres.", field_name, max_length)
    }

    pub fn one_of(field_name: &str, valid_values: &str) -> String {
        format!(
            "O campo {} deve ser um dos seguintes valores: {}.",
            field_name, valid_values
        )
    }
}

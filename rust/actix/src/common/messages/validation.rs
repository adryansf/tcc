pub struct ValidationMessages;

impl ValidationMessages {
    pub fn invalid_cpf(field_name: &str) -> String {
        format!("O campo {} deve ser um CPF válido.", field_name)
    }
}

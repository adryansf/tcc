use validator::ValidationError;
use cpf as CPF;
use crate::common::helper::clean_digits::clean_digits;
use crate::common::messages::validation::ValidationMessages;
use uuid::Uuid;

/// Valida se o CPF é válido
pub fn validate_cpf(cpf: &str) -> Result<(), ValidationError> {
    let cpf = clean_digits(cpf);

    if !CPF::valid(cpf) {
        let field_name = "cpf";
        let message = ValidationMessages::invalid_cpf(field_name);

        let error = ValidationError::new("invalid_cpf").with_message(message.into());

        return Err(error);
    }

    Ok(())
}

/// Valida se o UUID é válido
pub fn validate_uuid(id: &str) -> Result<(), validator::ValidationError> {
    match Uuid::parse_str(id) {
        Ok(_) => Ok(()),
        Err(_) => Err(validator::ValidationError::new("uuid").with_message("O campo id deve ser um UUID.".into())),
    }
}
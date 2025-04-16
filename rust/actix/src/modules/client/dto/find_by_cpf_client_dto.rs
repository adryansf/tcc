use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::common::validator::validate_cpf;
use crate::common::helper::clean_digits::clean_digits;

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct FindByCPFClientDto {
    #[validate(custom(function = "validate_cpf"))]
    pub cpf: String,
}

impl FindByCPFClientDto {
    pub fn transform(&mut self) {
        // CPF
        self.cpf = clean_digits(&self.cpf);
    }
}

use serde::{Deserialize, Serialize};
// use validator::Validate;
// use crate::internal::common::helper;

#[derive(Debug, Deserialize, Serialize)]
pub struct FindByCPFClientDto {
    // #[validate(custom = "helper::validate_cpf")]
    pub cpf: String,
}

impl FindByCPFClientDto {
    pub fn transform(&mut self) {
        // CPF
        // self.cpf = helper::clean_digits(&self.cpf);
    }
}

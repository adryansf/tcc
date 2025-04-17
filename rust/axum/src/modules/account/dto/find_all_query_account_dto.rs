use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::common::validator::validate_cpf;
use crate::common::helper::clean_digits::clean_digits;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct FindAllQueryAccountDto {
    #[validate(custom(function = "validate_cpf"))]
    pub cpf: String,
}

impl FindAllQueryAccountDto {
    pub fn transform(&mut self) {
        self.cpf = clean_digits(&self.cpf);
    }
}
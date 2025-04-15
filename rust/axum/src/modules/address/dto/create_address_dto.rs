use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::common::helper::clean_digits::clean_digits;
#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct CreateAddressDto {
    #[validate(length(min = 1, message = "O campo logradouro é obrigatório."))]
    pub logradouro: String,

    #[validate(length(min = 1, message = "O campo número é obrigatório."))]
    pub numero: String,

    #[validate(length(min = 1, message = "O campo bairro é obrigatório."))]
    pub bairro: String,

    #[validate(length(min = 1, message = "O campo cidade é obrigatório."))]
    pub cidade: String,

    #[validate(length(equal = 2, message = "O campo UF deve ter 2 caracteres."))]
    pub uf: String,

    pub complemento: Option<String>,

    #[validate(length(min = 8, message = "O campo CEP deve ter no mínimo 8 caracteres."))]
    pub cep: String,
}

impl CreateAddressDto {
    pub fn transform(&mut self) {
       self.cep = clean_digits(&self.cep);
    }
}
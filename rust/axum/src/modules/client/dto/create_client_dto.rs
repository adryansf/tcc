// use serde::{Deserialize, Serialize};
// use validator::Validate;
// use crate::internal::common::helper;

// #[derive(Debug, Deserialize, Serialize, Validate)]
// pub struct CreateClientDto {
//     #[validate(length(min = 3))]
//     pub nome: String,
//     #[validate(custom = "helper::validate_cpf")]
//     pub cpf: String,
//     #[validate(required)]
//     pub telefone: String,
//     #[validate(custom = "helper::validate_date_format")]
//     pub data_de_nascimento: String,
//     #[validate(email)]
//     pub email: String,
//     #[validate(length(min = 8), custom = "helper::validate_password")]
//     pub senha: String,
// }

// impl CreateClientDto {
//     pub fn transform(&mut self) {
//         // Nome
//         self.nome = helper::remove_accents(&self.nome.trim().to_uppercase());

//         // CPF
//         self.cpf = helper::clean_digits(&self.cpf);

//         // Telefone
//         self.telefone = helper::clean_digits(&self.telefone);

//         // DataDeNascimento
//         if let Ok(t) = chrono::NaiveDate::parse_from_str(&self.data_de_nascimento, "%Y-%m-%d") {
//             self.data_de_nascimento = t.format("%Y-%m-%d").to_string();
//         }
//     }
// }

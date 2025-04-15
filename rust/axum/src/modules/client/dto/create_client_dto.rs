use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::common::helper::{clean_digits::clean_digits, remove_accents::remove_accents};
use crate::common::validator::validate_cpf;

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct CreateClientDto {
    #[validate(length(min = 3, message="O campo nome deve ter no mínimo 3 caracteres."))]
    pub nome: String,
    #[validate(custom(function = "validate_cpf"))]
    pub cpf: String,
    #[validate(length(min = 1,message = "O campo telefone é obrigatório."))]
    pub telefone: String,
    #[serde(rename = "dataDeNascimento", with = "naive_date_format")]
    pub data_de_nascimento: NaiveDate,
    #[validate(email(message = "O campo email deve ser um email."))]
    pub email: String,
    #[validate(length(min = 8, message = "O campo senha deve ter no mínimo 8 caracteres."))]
    pub senha: String,
}

impl CreateClientDto {
    pub fn transform(&mut self) {
        // Nome
        self.nome = remove_accents(&self.nome.trim().to_uppercase());

        // CPF
        self.cpf = clean_digits(&self.cpf);

        // Telefone
        self.telefone = clean_digits(&self.telefone);
    }
}


mod naive_date_format {
    use chrono::NaiveDate;
    use serde::{self, Deserialize, Deserializer, Serializer};

    const FORMAT: &str = "%Y-%m-%d";

    pub fn serialize<S>(date: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = date.format(FORMAT).to_string();
        serializer.serialize_str(&s)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDate::parse_from_str(&s, FORMAT).map_err(|_| {
            serde::de::Error::custom("O campo dataDeNascimento deve ser uma data válida.")
        })
    }
}
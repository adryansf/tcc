#![allow(non_snake_case, dead_code)]

use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDate, NaiveDateTime};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, FromRow)]
pub struct ClientEntity {
    pub id: Uuid,
    pub nome: String,
    pub cpf: String,
    pub telefone: String,
    pub dataDeNascimento: NaiveDate,
    pub email: String,
    #[serde(skip_serializing)]
    pub senha: String,
    pub dataDeCriacao: Option<NaiveDateTime>,
    pub dataDeAtualizacao: Option<NaiveDateTime>,
    // pub endereco: Option<AddressEntity>,
}

// pub fn parse_endereco(endereco_json: &str) -> Option<AddressEntity> {
//     if !endereco_json.is_empty() {
//         serde_json::from_str(endereco_json).ok()
//     } else {
//         None
//     }
// }

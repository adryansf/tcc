use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::NaiveDateTime;

#[derive(Serialize, Deserialize, Debug, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AddressEntity {
    pub id: Option<Uuid>,
    pub logradouro: Option<String>,
    pub numero: Option<String>,
    pub bairro: Option<String>,
    pub cidade: Option<String>,
    pub uf: Option<String>,
    pub complemento: Option<String>,
    pub cep: Option<String>,
    #[sqlx(rename = "idCliente")]
    #[serde(rename = "idCliente")]
    pub id_cliente: Option<Uuid>,
    #[sqlx(rename = "dataDeCriacao")]
    #[serde(rename = "dataDeCriacao")]
    pub data_de_criacao: Option<NaiveDateTime>,
    #[sqlx(rename = "dataDeAtualizacao")]
    #[serde(rename = "dataDeAtualizacao")]
    pub data_de_atualizacao: Option<NaiveDateTime>,
}
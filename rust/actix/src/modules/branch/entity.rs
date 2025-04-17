use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use sqlx::FromRow;


#[derive(Serialize, Deserialize, Debug, FromRow)]
pub struct BranchEntity {
    pub id: Uuid,
    pub nome: String,
    pub numero: i32,
    pub telefone: String,
    #[sqlx(rename = "dataDeCriacao")]
    #[serde(rename = "dataDeCriacao")]
    pub data_de_criacao: Option<NaiveDateTime>,
    #[sqlx(rename = "dataDeAtualizacao")]
    #[serde(rename = "dataDeAtualizacao")]
    pub data_de_atualizacao: Option<NaiveDateTime>,
}
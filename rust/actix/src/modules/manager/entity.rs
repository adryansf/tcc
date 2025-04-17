use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{NaiveDate, NaiveDateTime};
use sqlx::FromRow;
use serde_json::Value;
#[derive(Serialize, Deserialize, Debug, FromRow)]
pub struct ManagerEntity {
	pub id: Uuid,
  #[sqlx(rename = "idAgencia")]
  #[serde(rename = "idAgencia")]
	pub id_agencia: Uuid,
	pub nome: String,
	pub cpf: String,
	pub telefone: String,
  #[sqlx(rename = "dataDeNascimento")]
  #[serde(rename = "dataDeNascimento")]
	pub data_de_nascimento: NaiveDate,
	pub email: String,
	#[serde(skip_serializing)]
	pub senha: String,
	#[sqlx(rename = "dataDeCriacao")]
	#[serde(rename = "dataDeCriacao")]
	pub data_de_criacao: Option<NaiveDateTime>,
	#[sqlx(rename = "dataDeAtualizacao")]
	#[serde(rename = "dataDeAtualizacao")]
	pub data_de_atualizacao: Option<NaiveDateTime>,
  #[sqlx(default)]
  #[serde(skip_serializing_if = "Option::is_none")]
  pub agencia: Option<Value>,
}
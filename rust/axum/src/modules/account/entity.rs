use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::NaiveDateTime;
use sqlx::FromRow;
use serde_json::Value;
use bigdecimal::BigDecimal;
use num_traits::ToPrimitive;

fn serialize_bigdecimal<S>(value: &Option<BigDecimal>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    match value {
        Some(v) => {
            if let Some(f) = v.to_f64() {
                serializer.serialize_f64(f)
            } else {
                serializer.serialize_str(&v.to_string())
            }
        },
        None => serializer.serialize_none(),
    }
}

#[derive(Serialize, Deserialize, Debug, FromRow)]
pub struct AccountEntity {
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<Uuid>,
    pub numero: i32,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(serialize_with = "serialize_bigdecimal")]
    pub saldo: Option<BigDecimal>,
    pub tipo: String,
    #[sqlx(default)]
    #[sqlx(rename = "idAgencia")]
    #[serde(rename = "idAgencia")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id_agencia: Option<Uuid>,
    #[sqlx(default)]
    #[sqlx(rename = "idCliente")]
    #[serde(rename = "idCliente")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id_cliente: Option<Uuid>,   
    #[sqlx(rename = "dataDeCriacao")]
    #[serde(rename = "dataDeCriacao")]
    pub data_de_criacao: NaiveDateTime,
    #[sqlx(rename = "dataDeAtualizacao")]
    #[serde(rename = "dataDeAtualizacao")]
    pub data_de_atualizacao: NaiveDateTime,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cliente: Option<Value>,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agencia: Option<Value>,
}
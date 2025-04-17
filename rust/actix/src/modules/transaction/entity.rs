use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use serde_json::Value;
use bigdecimal::BigDecimal;
use chrono::NaiveDateTime;
use num_traits::ToPrimitive;

fn serialize_bigdecimal<S>(value: &BigDecimal, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    if let Some(f) = value.to_f64() {
        serializer.serialize_f64(f)
    } else {
        serializer.serialize_str(&value.to_string())
    }
}


#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
#[sqlx(rename_all = "camelCase")]
pub struct TransactionEntity {
    pub id: Uuid,
    #[serde(serialize_with = "serialize_bigdecimal")]
    pub valor: BigDecimal,
    pub tipo: String,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id_conta_origem: Option<Uuid>,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id_conta_destino: Option<Uuid>,
    pub data_de_criacao: NaiveDateTime,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub conta_origem: Option<Value>,
    #[sqlx(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub conta_destino: Option<Value>,
} 
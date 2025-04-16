use serde::Deserialize;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FindAllQueryTransactionsDto {
    pub id_conta: Uuid,
} 
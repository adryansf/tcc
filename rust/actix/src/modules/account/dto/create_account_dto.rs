use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;
use crate::modules::account::enums::AccountTypeEnum;

#[derive(Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateAccountDto {
    #[validate(required)]
    pub tipo: Option<AccountTypeEnum>,
    
    pub id_agencia: Option<Uuid>,
    
    pub id_cliente: Option<Uuid>,
}
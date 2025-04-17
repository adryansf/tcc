use serde::{Deserialize, Serialize};
use crate::common::enums::role::RoleEnum;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JwtPayload {
    pub id: String,
    pub email: String,
    pub role: RoleEnum,
    pub cpf: String,
} 
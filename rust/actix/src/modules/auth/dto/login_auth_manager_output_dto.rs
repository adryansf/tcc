use serde::Serialize;
use crate::modules::manager::entity::ManagerEntity;

#[derive(Serialize)]
pub struct LoginAuthManagerOutputDto {
    pub usuario: ManagerEntity,
    pub token: String,
    pub expira_em: String,
} 
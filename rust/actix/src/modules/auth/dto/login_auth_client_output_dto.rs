use serde::Serialize;
use crate::modules::client::entity::ClientEntity;

#[derive(Serialize)]
pub struct LoginAuthClientOutputDto {
    pub usuario: ClientEntity,
    pub token: String,
    pub expira_em: String,
} 
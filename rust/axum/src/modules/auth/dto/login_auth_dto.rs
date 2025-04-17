use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct LoginAuthDto {
    #[validate(email(message = "O campo deve ser um email."))]
    pub email: String,
    
    #[validate(length(min = 8, message = "O campo deve ter no mínimo 8 caracteres."))]
    pub senha: String,
} 
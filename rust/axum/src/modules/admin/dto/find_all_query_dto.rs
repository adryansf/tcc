use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct FindAllQueryDto {
    #[validate(range(min = 1, message = "O campo quantidade deve ser um valor positivo."))]
    pub quantidade: i32,
} 
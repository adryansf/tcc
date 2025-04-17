use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::common::validator::validate_uuid;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct FindOneAccountDto {
    #[validate(custom(function = "validate_uuid"))]
    pub id: String,
}


use validator::ValidationErrors;

use super::base::BaseError;

pub fn unauthorized_error(message: &str, errors: Option<ValidationErrors>) -> BaseError {
    BaseError::new(message, 401, errors)
}
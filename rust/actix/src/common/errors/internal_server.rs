use validator::ValidationErrors;

use super::base::BaseError;

pub fn internal_server_error(message: &str, errors: Option<ValidationErrors>) -> BaseError {
    BaseError::new(message, 500, errors)
}
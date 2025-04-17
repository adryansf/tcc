use validator::ValidationErrors;

use super::base::BaseError;

pub fn bad_request_error(message: &str, errors: Option<ValidationErrors>) -> BaseError {
    BaseError::new(message, 400, errors)
}
use validator::ValidationErrors;

use super::base::BaseError;

pub fn not_found_error(message: &str, errors: Option<ValidationErrors>) -> BaseError {
    BaseError::new(message, 404, errors)
}
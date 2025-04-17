use serde::Serialize;
use validator::ValidationErrors;

#[derive(Debug, Serialize)]
pub struct BaseError {
    pub message: String,
    pub status_code: u16,
    pub errors: Option<Vec<String>>,
}

impl BaseError {
    pub fn new(message: &str, status_code: u16, errors: Option<ValidationErrors>) -> Self {
        let error_messages = errors.map(|validation_errors| {
            validation_errors
                .field_errors()
                .iter()
                .map(|(field, errors)| {
                    format!(
                        "{}: {}",
                        field,
                        errors
                            .iter()
                            .map(|e| e.message.clone().unwrap_or_default())
                            .collect::<Vec<_>>()
                            .join(", ")
                    )
                })
                .collect::<Vec<String>>()
        });

        Self {
            message: message.to_string(),
            status_code,
            errors: error_messages,
        }
    }
}
use serde::Serialize;
use validator::ValidationErrors;
use std::fmt;
use actix_web::{Responder, http::StatusCode, HttpResponse};

#[derive(Debug, Serialize)]
pub struct BaseError {
    pub message: String,
    pub status_code: u16,
    pub errors: Option<Vec<String>>,
}

impl fmt::Display for BaseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl Responder for BaseError {
    type Body = actix_web::body::BoxBody;

    fn respond_to(self, _req: &actix_web::HttpRequest) -> actix_web::HttpResponse<Self::Body> {
        let status_code = StatusCode::from_u16(self.status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);
        HttpResponse::build(status_code).json(self)
    }
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
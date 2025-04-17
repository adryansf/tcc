use actix_web::{HttpResponse, ResponseError};
use actix_web::http::StatusCode;
use serde_json::json;
use super::base::BaseError;

impl ResponseError for BaseError {
    fn error_response(&self) -> HttpResponse {
        let status_code = StatusCode::from_u16(self.status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);
        let body = if self.errors.is_none() {
            json!({
                "message": self.message,
                "statusCode": self.status_code,
            })
        } else {
            json!({
                "message": self.message,
                "statusCode": self.status_code,
                "errors": self.errors,
            })
        };

        HttpResponse::build(status_code).json(body)
    }
}
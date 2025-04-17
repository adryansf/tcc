use axum::response::{IntoResponse, Response};
use axum::http::StatusCode;
use serde_json::json;
use super::base::BaseError;

impl IntoResponse for BaseError {
    fn into_response(self) -> Response {
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

        (status_code, axum::Json(body)).into_response()
    }
}
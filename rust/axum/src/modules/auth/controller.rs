use axum::{Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use crate::common::errors::base::BaseError;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use validator::Validate;

use super::service::AuthService;
use super::dto::{LoginAuthDto, LoginAuthClientOutputDto, LoginAuthManagerOutputDto};

#[derive(Debug)]
pub struct AuthController {
}

impl AuthController {
    pub async fn login_client(
        Json(dto): Json<LoginAuthDto>,
    ) -> Result<Json<LoginAuthClientOutputDto>, BaseError> {
        if let Err(errors) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(errors)));
        }

        match AuthService::login_client(dto).await {
            Ok(result) => Ok(Json(result)),
            Err(err) => Err(err),
        }
    }

    pub async fn login_manager(
        Json(dto): Json<LoginAuthDto>,
    ) -> Result<Json<LoginAuthManagerOutputDto>, BaseError> {
        if let Err(errors) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(errors)));
        }

        match AuthService::login_manager(dto).await {
            Ok(result) => Ok(Json(result)),
            Err(err) => Err(err),
        }
    }
}
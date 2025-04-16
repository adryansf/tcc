use actix_web::{web, HttpResponse, Responder};
use crate::common::errors::base::BaseError;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use validator::Validate;

use super::service::AuthService;
use super::dto::LoginAuthDto;

#[derive(Debug)]
pub struct AuthController;

impl AuthController {
    pub async fn login_client(
        dto: web::Json<LoginAuthDto>,
    ) -> Result<impl Responder, BaseError> {
        if let Err(errors) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(errors)));
        }

        match AuthService::login_client(dto.into_inner()).await {
            Ok(result) => Ok(HttpResponse::Ok().json(result)),
            Err(err) => Err(err),
        }
    }

    pub async fn login_manager(
        dto: web::Json<LoginAuthDto>,
    ) -> Result<impl Responder, BaseError> {
        if let Err(errors) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(errors)));
        }

        match AuthService::login_manager(dto.into_inner()).await {
            Ok(result) => Ok(HttpResponse::Ok().json(result)),
            Err(err) => Err(err),
        }
    }
}
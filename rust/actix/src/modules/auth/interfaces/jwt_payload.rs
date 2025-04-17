use actix_web::FromRequest;
use actix_web::HttpRequest;
use actix_web::Error;
use actix_web::HttpMessage;
use futures::future::{ready, Ready};
use serde::{Deserialize, Serialize};
use crate::common::enums::role::RoleEnum;
use crate::common::errors::unauthorized::unauthorized_error;
use crate::common::messages::error::ErrorMessages;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JwtPayload {
    pub id: String,
    pub email: String,
    pub role: RoleEnum,
    pub cpf: String,
}

impl FromRequest for JwtPayload {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut actix_web::dev::Payload) -> Self::Future {
        let value = req.extensions().get::<JwtPayload>().cloned();
        let result = match value {
            Some(v) => Ok(v),
            None => Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None).into()),
        };
        ready(result)
    }
} 
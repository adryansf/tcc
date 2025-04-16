use actix_web::{web, HttpResponse, Responder};
use actix_web::web::Json;
use validator::Validate;
use crate::{common::errors::bad_request::bad_request_error, modules::auth::interfaces::JwtPayload};
use crate::common::messages::error::ErrorMessages;
use crate::common::errors::base::BaseError;
use super::service::AccountService;
use super::dto::{
    FindAllQueryAccountDto,
    CreateAccountDto,
    FindOneAccountDto,
};

pub struct AccountController {
}

impl AccountController {
    pub async fn find_all(
        mut dto: web::Query<FindAllQueryAccountDto>,
    ) -> Result<impl Responder, BaseError> {
        dto.transform();

        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match AccountService::find_all(&dto.cpf).await {
            Ok(accounts) => Ok(Json(accounts)),
            Err(err) => Err(err),
        }
    }

    pub async fn create(
        auth: web::ReqData<JwtPayload>,
        dto: web::Json<CreateAccountDto>,
    ) -> Result<impl Responder, BaseError> {
        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match AccountService::create(dto.into_inner(), &auth.id, auth.clone().into_inner()).await {
            Ok(_) => Ok(HttpResponse::Created().finish()),
            Err(err) => Err(err),
        }
    }

    pub async fn find_by_id(
        auth: web::ReqData<JwtPayload>,
        id: web::Path<String>,
    ) -> Result<impl Responder, BaseError> {
        let dto = FindOneAccountDto { id: id.into_inner() };

        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match AccountService::find_by_id(&dto.id, &auth.id, auth.role).await {
            Ok(mut account) => {
                // Omitindo campos não necessários
                account.id_agencia = None;
                account.id_cliente = None;
                Ok(Json(account))
            },
            Err(err) => Err(err),
        }
    }
}

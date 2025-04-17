use axum::{
    extract::{Path, Query}, http::StatusCode, response::IntoResponse, Extension, Json
};
use validator::Validate;
use crate::{common::errors::bad_request::bad_request_error, modules::auth::interfaces::JwtPayload};
use crate::common::messages::error::ErrorMessages;

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
        Query(mut dto): Query<FindAllQueryAccountDto>,
    ) -> impl IntoResponse {
        dto.transform();

        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        match AccountService::find_all(&dto.cpf).await {
            Ok(accounts) => Json(accounts).into_response(),
            Err(err) => err.into_response(),
        }
    }

    pub async fn create(
        Extension(auth): Extension<JwtPayload>,
        Json(dto): Json<CreateAccountDto>,
    ) -> impl IntoResponse {
        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        match AccountService::create(dto, &auth.id, auth.clone()).await {
            Ok(_) => StatusCode::CREATED.into_response(),
            Err(err) => err.into_response(),
        }
    }

    pub async fn find_by_id(
        Extension(auth): Extension<JwtPayload>,
        Path(id): Path<String>,
    ) -> impl IntoResponse {
        let dto = FindOneAccountDto { id };

        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        match AccountService::find_by_id(&dto.id, &auth.id, auth.role).await {
            Ok(mut account) => {
                // Omitindo campos não necessários
                account.id_agencia = None;
                account.id_cliente = None;
                Json(account).into_response()
            },
            Err(err) => err.into_response(),
        }
    }
}

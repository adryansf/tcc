use axum::{
    extract::Query,
    response::IntoResponse,
    Json
};
use validator::Validate;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;

use super::dto::FindAllQueryDto;
use super::service::AdminService;

pub struct AdminController{
}

impl AdminController {
    pub async fn find_all_managers(
        Query(dto): Query<FindAllQueryDto>
    ) -> impl IntoResponse {
        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        match AdminService::find_all_managers(dto.quantidade).await {
            Ok(managers) => Json(managers).into_response(),
            Err(err) => err.into_response(),
        }
    }

    pub async fn find_all_clients(
        Query(dto): Query<FindAllQueryDto>
    ) -> impl IntoResponse {
        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        match AdminService::find_all_clients(dto.quantidade).await {
            Ok(clients) => Json(clients).into_response(),
            Err(err) => err.into_response(),
        }
    }
}

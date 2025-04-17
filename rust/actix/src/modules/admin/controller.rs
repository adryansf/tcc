use actix_web::{
    web::Query,
    HttpResponse
};
use validator::Validate;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::errors::base::BaseError;

use super::dto::FindAllQueryDto;
use super::service::AdminService;

pub struct AdminController{
}

impl AdminController {
    pub async fn find_all_managers(
        dto: Query<FindAllQueryDto>
    ) -> Result<HttpResponse, BaseError> {
        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match AdminService::find_all_managers(dto.quantidade).await {
            Ok(managers) => Ok(HttpResponse::Ok().json(managers)),
            Err(err) => Err(err),
        }
    }

    pub async fn find_all_clients(
        dto: Query<FindAllQueryDto>
    ) -> Result<HttpResponse, BaseError> {
        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match AdminService::find_all_clients(dto.quantidade).await {
            Ok(clients) => Ok(HttpResponse::Ok().json(clients)),
            Err(err) => Err(err),
        }
    }
}

use actix_web::{
    web::{Json, Query},
    HttpResponse
};
use validator::Validate;
use crate::modules::auth::interfaces::JwtPayload;
use crate::modules::transaction::service::TransactionService;
use crate::modules::transaction::dto::CreateTransactionDto;
use crate::modules::transaction::dto::FindAllQueryTransactionsDto;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::errors::base::BaseError;

use super::entity::TransactionEntity;
pub struct TransactionController;

impl TransactionController {
    pub async fn find_all(
        auth: JwtPayload,
        query: Query<FindAllQueryTransactionsDto>,
    ) -> Result<Json<Vec<TransactionEntity>>, BaseError> {
        match TransactionService::find_all(query.id_conta, auth.id, auth.role).await {
            Ok(transactions) => Ok(Json(transactions)),
            Err(err) => Err(err),
        }
    }

    pub async fn create(
        auth: JwtPayload,
        dto: Json<CreateTransactionDto>,
    ) -> Result<HttpResponse, BaseError> {
        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        if let Err(err) = dto.validate_transaction() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match TransactionService::create(dto.into_inner(), auth.id).await {
            Ok(_) => Ok(HttpResponse::Created().finish()),
            Err(err) => Err(err),
        }
    }
} 
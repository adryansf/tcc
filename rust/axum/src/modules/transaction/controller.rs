use axum::{
    extract::{Extension, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use validator::Validate;
use crate::modules::auth::interfaces::JwtPayload;
use crate::modules::transaction::service::TransactionService;
use crate::modules::transaction::dto::CreateTransactionDto;
use crate::modules::transaction::dto::FindAllQueryTransactionsDto;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;

pub struct TransactionController {
}

impl TransactionController {
    pub async fn find_all(
        Extension(auth): Extension<JwtPayload>,
        Query(query): Query<FindAllQueryTransactionsDto>,
    ) -> impl IntoResponse {       
        match TransactionService::find_all(query.id_conta, auth.id, auth.role).await {
            Ok(transactions) => (StatusCode::OK, Json(transactions)).into_response(),
            Err(err) => err.into_response(),
        }
    }

    pub async fn create(
        Extension(auth): Extension<JwtPayload>,
        Json(dto): Json<CreateTransactionDto>,
    ) -> impl IntoResponse {
        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        if let Err(err) = dto.validate_transaction() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }


        match TransactionService::create(dto, auth.id).await {
            Ok(_) => StatusCode::CREATED.into_response(),
            Err(err) => err.into_response(),
        }
    }
} 
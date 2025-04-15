use axum::{
    middleware::from_fn, routing::{get, post}, Router
};

use crate::modules::auth::middleware::auth_middleware;
use crate::modules::transaction::controller::TransactionController;

pub fn transaction_module() -> Router {
    let router =Router::new()
        .route("/", get(TransactionController::find_all)).layer(from_fn(auth_middleware))
        .route("/", post(TransactionController::create)).layer(from_fn(auth_middleware));

    Router::new().nest("/transacoes", router)
} 
use axum::{Router, routing::get, routing::post, middleware::from_fn,};
use super::controller::AccountController;
use crate::modules::auth::middleware::auth_middleware;

pub fn account_module() -> Router {
    let router = 
    Router::new()
    .route("/", get(AccountController::find_all))
    .layer(from_fn(auth_middleware))
    .route("/", post(AccountController::create))
    .layer(from_fn(auth_middleware))
    .route("/{id}", get(AccountController::find_by_id))
    .layer(from_fn(auth_middleware));

    Router::new().nest("/contas", router)
}

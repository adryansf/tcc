use axum::{Router, routing::get, middleware::from_fn,};
use crate::modules::auth::middleware::auth_middleware;
use super::controller::BranchController;

pub fn branch_module() -> Router {
    let router = 
    Router::new()
    .route("/", get(BranchController::find_all)).layer(from_fn(auth_middleware));

    Router::new().nest("/agencias", router)
}

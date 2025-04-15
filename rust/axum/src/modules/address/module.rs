use axum::{Router, routing::post, middleware::from_fn};
use super::controller::AddressController;
use crate::modules::auth::middleware::auth_middleware;

pub fn address_module() -> Router {
    let router = Router::new()
        .route("/", post(AddressController::create))
        .layer(from_fn(auth_middleware));

    Router::new().nest("/enderecos", router)
}
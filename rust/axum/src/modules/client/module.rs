use axum::{Router, routing::get, routing::post, middleware::from_fn,};
use super::controller::ClientController;
use crate::modules::auth::middleware::auth_middleware;
use crate::common::middleware::roles_permitted_middleware;
use crate::common::enums::role::RoleEnum;

pub fn client_module() -> Router {
    let router = 
    Router::new()
    .route("/cpf/{cpf}", get(ClientController::find_by_cpf))
    .layer(from_fn(|req, next| { 
        roles_permitted_middleware(req, next, vec![RoleEnum::Manager])
    }))
    .layer(from_fn(auth_middleware))
    .route("/", post(ClientController::create));

    Router::new().nest("/clientes", router)
}

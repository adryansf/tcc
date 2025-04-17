use axum::{Router, routing::post};

use super::controller::AuthController;

pub fn auth_module() -> Router {
    let router = Router::new()
        .route("/login/clientes", post(AuthController::login_client))
        .route("/login/gerentes", post(AuthController::login_manager));

    Router::new().nest("/auth", router)
}
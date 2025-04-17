use axum::{Router, routing::get};
use super::controller::AdminController;

pub fn admin_module() -> Router {
    let router = 
    Router::new()
    .route("/clientes", get(AdminController::find_all_clients))
    .route("/gerentes", get(AdminController::find_all_managers));

    Router::new().nest("/admin", router)
}

use axum::{Router, routing::get, routing::post};
use super::controller::ClientController;

pub fn client_module() -> Router {

    let router = Router::new().route("/cpf/{cpf}", get(ClientController::find_by_cpf));

    Router::new().nest("/clientes", router)
}

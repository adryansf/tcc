use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use super::controller::ClientController;
use crate::modules::auth::middleware::AuthMiddleware;
use crate::common::middleware::RolesPermittedMiddleware;
use crate::common::enums::role::RoleEnum;

pub fn client_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/clientes")
        .service(
            web::resource("/cpf/{cpf}")
                .route(web::get().to(ClientController::find_by_cpf))
                .wrap(RolesPermittedMiddleware::new(vec![RoleEnum::Manager]))
                .wrap(AuthMiddleware)
        )
        .service(
            web::resource("")
                .route(web::post().to(ClientController::create))
        )
}

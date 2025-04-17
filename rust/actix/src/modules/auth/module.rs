use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use super::controller::AuthController;

pub fn auth_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/auth")
        .service(
            web::resource("/login/clientes")
                .route(web::post().to(AuthController::login_client))
        )
        .service(
            web::resource("/login/gerentes")
                .route(web::post().to(AuthController::login_manager))
        )
}
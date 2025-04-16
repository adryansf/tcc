use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use super::controller::AccountController;
use crate::modules::auth::middleware::AuthMiddleware;

pub fn account_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/contas")
        .wrap(AuthMiddleware)
        .service(
            web::resource("")
                .route(web::get().to(AccountController::find_all))
                .route(web::post().to(AccountController::create))
        )
        .service(
            web::resource("/{id}")
                .route(web::get().to(AccountController::find_by_id))
        )
}

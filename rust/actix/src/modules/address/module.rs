use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use super::controller::AddressController;
use crate::modules::auth::middleware::AuthMiddleware;

pub fn address_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/enderecos")
        .wrap(AuthMiddleware)
        .route("", web::post().to(AddressController::create))
}
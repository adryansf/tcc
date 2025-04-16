use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use crate::modules::auth::middleware::AuthMiddleware;
use super::controller::BranchController;

pub fn branch_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/agencias")
        .wrap(AuthMiddleware)
        .route("", web::get().to(BranchController::find_all))
}

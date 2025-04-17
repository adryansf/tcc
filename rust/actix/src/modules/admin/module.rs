use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use super::controller::AdminController;

pub fn admin_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/admin")
        .service(
            web::resource("/clientes")
                .route(web::get().to(AdminController::find_all_clients))
        )
        .service(
            web::resource("/gerentes")
                .route(web::get().to(AdminController::find_all_managers))
        )
}

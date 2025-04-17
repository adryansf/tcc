use actix_web::{web, Scope, dev::ServiceFactory};
use actix_web::dev::ServiceRequest;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use crate::modules::auth::middleware::AuthMiddleware;
use crate::modules::transaction::controller::TransactionController;

pub fn transaction_module() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse, Error = Error, InitError = ()>> {
    web::scope("/transacoes")
        .wrap(AuthMiddleware)
        .service(
            web::resource("")
                .route(web::get().to(TransactionController::find_all))
                .route(web::post().to(TransactionController::create))
        )
} 
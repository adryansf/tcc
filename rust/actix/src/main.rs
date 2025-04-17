use actix_web::{App, HttpServer};
#[cfg(debug_assertions)]
use dotenvy;

mod database;
mod modules;
mod common;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    #[cfg(debug_assertions)]
    {
        dotenvy::dotenv().expect("Failed to read .env file");
    }

    let port: String = std::env::var("SERVER_PORT").expect("SERVER_PORT not set in environment variables");

    database::connect().await;

    println!("✅ Servidor rodando na porta: {}", port);
    
    HttpServer::new(|| {
        App::new()
            .service(modules::client::module::client_module())
            .service(modules::address::module::address_module())
            .service(modules::auth::module::auth_module())
            .service(modules::branch::module::branch_module())
            .service(modules::account::module::account_module())
            .service(modules::admin::module::admin_module())
            .service(modules::transaction::module::transaction_module())
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
use axum::Router;
use dotenvy;

mod database;
mod modules;
mod common;

#[tokio::main]
async fn main(){
    dotenvy::dotenv().expect("Failed to read .env file");

    let port: String = std::env::var("SERVER_PORT").expect("SERVER_PORT not set in .env file");

    database::connect().await;


    let app = Router::new()
                                .merge(modules::client::module::client_module())
                                .merge(modules::address::module::address_module())
                                .merge(modules::auth::module::auth_module())
                                .merge(modules::branch::module::branch_module())
                                .merge(modules::account::module::account_module())
                                .merge(modules::admin::module::admin_module())
                                .merge(modules::transaction::module::transaction_module());

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    println!("✅ Servidor rodando na porta: {}", port);
    axum::serve(listener, app).await.unwrap();
}
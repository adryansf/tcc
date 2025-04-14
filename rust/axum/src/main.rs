use axum::Router;
use dotenvy;


mod database;
mod modules;

#[tokio::main]
async fn main(){
    dotenvy::dotenv().expect("Failed to read .env file");

    let port: String = std::env::var("SERVER_PORT").expect("SERVER_PORT not set in .env file");


    let app = Router::new()
                                .merge(modules::client::module::client_module());

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    println!("✅ Servidor rodando na porta: {}", port);
    axum::serve(listener, app).await.unwrap();
    
}
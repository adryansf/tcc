use sqlx::{PgConnection, Connection};
use std::env;

/// Conecta ao banco de dados sem usar pooling e retorna uma conexão única
pub async fn connect() -> Result<PgConnection, sqlx::Error> {
    let host = env::var("DB_HOST").expect("DB_HOST não definida no .env");
    let port = env::var("DB_PORT").expect("DB_PORT não definida no .env");
    let user = env::var("DB_USER").expect("DB_USER não definido no .env");
    let password = env::var("DB_PASSWORD").expect("DB_PASSWORD não definido no .env");
    let dbname = env::var("DB_NAME").expect("DB_NAME não definido no .env");

    let database_url = format!("postgres://{}:{}@{}:{}/{}", user, password, host, port, dbname);

    // Estabelece uma conexão única com o banco de dados
    let conn = PgConnection::connect(&database_url).await?;
    Ok(conn)
}
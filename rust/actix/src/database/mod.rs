use sqlx::{PgPool, postgres::PgPoolOptions};
use once_cell::sync::OnceCell;
use std::env;

static DB_POOL: OnceCell<PgPool> = OnceCell::new();

pub async fn connect() {
    let host = env::var("DB_HOST").expect("DB_HOST não definida no .env");
    let port = env::var("DB_PORT").expect("DB_PORT não definida no .env");
    let user = env::var("DB_USER").expect("DB_USER não definido no .env");
    let password = env::var("DB_PASSWORD").expect("DB_PASSWORD não definido no .env");
    let dbname = env::var("DB_NAME").expect("DB_NAME não definido no .env");

    let database_url = format!("postgres://{}:{}@{}:{}/{}", user, password, host, port, dbname);

    let pool = PgPoolOptions::new()
        .min_connections(100)
        .max_connections(100)
        .connect(&database_url)
        .await
        .expect("Erro ao conectar ao banco");

    DB_POOL.set(pool).expect("Pool já foi inicializada");
}

pub fn db() -> &'static PgPool {
    DB_POOL.get().expect("Pool ainda não foi inicializada")
}
use super::entity::ClientEntity;
use crate::database;
use sqlx::Error;
use chrono::NaiveDate;
use uuid::Uuid;

pub struct ICreateClientData {
    pub nome: String,
    pub cpf: String,
    pub telefone: String,
    pub data_de_nascimento: NaiveDate,
    pub email: String,
    pub senha: String,
}

pub struct ClientRepository {
}

impl ClientRepository {
    pub async fn find_by_cpf(cpf: &str) -> Result<Option<ClientEntity>, Error> {
        let client =  sqlx::query_as::<_,ClientEntity>(r#"
            SELECT 
                c.id, 
                c.cpf as cpf,
                c.nome AS nome,
                c.telefone AS telefone,
                c."dataDeNascimento" AS "dataDeNascimento",
                c.email AS email,
                c.senha AS senha,
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" AS "dataDeAtualizacao",
                CASE 
                    WHEN e.id IS NOT NULL THEN 
                        json_build_object(
                            'logradouro', e.logradouro,
                            'numero', e.numero,
                            'bairro', e.bairro,
                            'cidade', e.cidade,
                            'uf', e.uf,
                            'complemento', e.complemento,
                            'cep', e.cep,
                            'dataDeCriacao', e."dataDeCriacao",
                            'dataDeAtualizacao', e."dataDeAtualizacao"
                        ) 
                    ELSE NULL 
                END AS endereco 
            FROM "Cliente" c
            LEFT JOIN "Endereco" e ON e."idCliente" = c.id
            WHERE c.cpf = $1 LIMIT 1
            "#).bind(cpf)
            .fetch_optional(database::db())
            .await;

        match client {
            Ok(client) => Ok(client),
            Err(err) => {
                return Err(err);
            }
        }
            
    }

    pub async fn create(data: ICreateClientData) -> Result<ClientEntity, Error> {
        let mut transaction:sqlx::Transaction<'_, sqlx::Postgres> = database::db().begin().await?;

        let client = sqlx::query_as::<_, ClientEntity>(
            r#"
            INSERT INTO "Cliente" (nome, cpf, telefone, "dataDeNascimento", email, senha)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            "#
        )
        .bind(&data.nome)
        .bind(&data.cpf)
        .bind(&data.telefone)
        .bind(&data.data_de_nascimento)
        .bind(&data.email)
        .bind(&data.senha)
        .fetch_one(&mut *transaction)
        .await;

        match client {
            Ok(client) => {
                // Commit da transação
                transaction.commit().await?;
                Ok(client)
            }
            Err(err) => {
                // Rollback em caso de erro
                transaction.rollback().await?;
                Err(err)
            }
        }
    }

    pub async fn find_by_email(email: &str) -> Result<Option<ClientEntity>, Error> {
        let client = sqlx::query_as::<_,ClientEntity>(r#"
            SELECT 
                c.id, 
                c.nome AS nome,
                c.cpf as cpf,
                c.telefone AS telefone,
                c."dataDeNascimento" AS "dataDeNascimento",
                c.email AS email,
                c.senha AS senha,
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" AS "dataDeAtualizacao",
                CASE 
                WHEN e.id IS NOT NULL THEN 
                    json_build_object(
                    'logradouro', e.logradouro,
                    'numero', e.numero,
                    'bairro', e.bairro,
                    'cidade', e.cidade,
                    'uf', e.uf,
                    'complemento', e.complemento,
                    'cep', e.cep,
                    'dataDeCriacao', e."dataDeCriacao",
                    'dataDeAtualizacao', e."dataDeAtualizacao"
                    ) 
                ELSE NULL 
                END AS endereco 
            FROM "Cliente" c
            LEFT JOIN "Endereco" e ON e."idCliente" = c.id
            WHERE c.email = $1 LIMIT 1
            "#)
            .bind(email)
            .fetch_optional(database::db())
            .await;

        match client {
            Ok(client) => Ok(client),
            Err(err) => {
                return Err(err);
            }
        }
    }

    pub async fn find_by_id(id: &str) -> Result<Option<ClientEntity>, Error> {
        let id = Uuid::parse_str(id)
            .map_err(|_| Error::Decode("Invalid UUID format".into()))?;

        let client =  sqlx::query_as::<_,ClientEntity>(r#"
            SELECT 
                c.id, 
                c.nome AS nome,
                c.cpf as cpf,
                c.telefone AS telefone,
                c."dataDeNascimento" AS "dataDeNascimento",
                c.email AS email,
                c.senha AS senha,
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" AS "dataDeAtualizacao",
                CASE 
                WHEN e.id IS NOT NULL THEN 
                    json_build_object(
                    'logradouro', e.logradouro,
                    'numero', e.numero,
                    'bairro', e.bairro,
                    'cidade', e.cidade,
                    'uf', e.uf,
                    'complemento', e.complemento,
                    'cep', e.cep,
                    'dataDeCriacao', e."dataDeCriacao",
                    'dataDeAtualizacao', e."dataDeAtualizacao"
                    ) 
                ELSE NULL 
                END AS endereco 
            FROM "Cliente" c
            LEFT JOIN "Endereco" e ON e."idCliente" = c.id
            WHERE c.id = $1 LIMIT 1
            "#).bind(id)
            .fetch_optional(database::db())
            .await;

        match client {
            Ok(client) => Ok(client),
            Err(err) => {
                return Err(err);
            }
        }
            
    }

    pub async fn find_all(quantidade: i32) -> Result<Vec<ClientEntity>, Error> {
        let clients = sqlx::query_as::<_, ClientEntity>(r#"
            SELECT 
                c.id, 
                c.nome AS nome,
                c.cpf as cpf,
                c.telefone AS telefone,
                c."dataDeNascimento" AS "dataDeNascimento",
                c.email AS email,
                c.senha AS senha,
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" AS "dataDeAtualizacao",
                NULL AS endereco
            FROM "Cliente" c
            LIMIT $1
        "#)
        .bind(quantidade)
        .fetch_all(database::db())
        .await?;

        Ok(clients)
    }
}
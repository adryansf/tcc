use sqlx::Error;
use uuid::Uuid;
use crate::modules::account::entity::AccountEntity;
use crate::database;

pub struct ICreateAccountData {
    pub tipo: String,
    pub id_agencia: Uuid,
    pub id_cliente: Uuid,
}

#[derive(Debug)]
pub struct IQueryFindAllAccounts {
    pub cpf: String,
}


pub struct AccountRepository {
}

impl AccountRepository {
    pub async fn create(data: ICreateAccountData) -> Result<AccountEntity, Error> {
        let mut transaction = database::db().begin().await?;

        let account = sqlx::query_as::<_, AccountEntity>(
            r#"
            INSERT INTO "Conta" (tipo, "idAgencia", "idCliente")
            VALUES ($1, $2, $3)
            RETURNING *
            "#
        )
        .bind(&data.tipo)
        .bind(&data.id_agencia)
        .bind(&data.id_cliente)
        .fetch_one(&mut *transaction)
        .await;

        match account {
            Ok(account) => {
                transaction.commit().await?;
                Ok(account)
            }
            Err(err) => {
                transaction.rollback().await?;
                Err(err)
            }
        }
    }

    pub async fn find_by_id(id: &str, join: bool) -> Result<Option<AccountEntity>, Error> {
        let id = Uuid::parse_str(id)
            .map_err(|_| Error::Decode("Invalid UUID format".into()))?;

        let mut query = String::from(
            r#"
            SELECT 
                c.id AS id,
                c.numero AS numero,
                c.saldo AS saldo,
                c.tipo AS tipo,
                c."idAgencia" AS "idAgencia",
                c."idCliente" AS "idCliente",
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" as "dataDeAtualizacao"
            "#
        );

        if join {
            query.push_str(
                r#"
                ,json_build_object(
                    'id', cli.id,
                    'nome', cli.nome,
                    'cpf', cli.cpf,
                    'dataDeNascimento', cli."dataDeNascimento",
                    'telefone', cli.telefone,
                    'email', cli.email,
                    'dataDeCriacao', cli."dataDeCriacao",
                    'dataDeAtualizacao', cli."dataDeAtualizacao"
                ) AS cliente,
                json_build_object(
                    'id', a.id,
                    'nome', a.nome,
                    'numero', a.numero,
                    'telefone', a.telefone,
                    'dataDeCriacao', a."dataDeCriacao",
                    'dataDeAtualizacao', a."dataDeAtualizacao"
                ) AS agencia
                "#
            );
        }

        query.push_str(r#" FROM "Conta" c"#);

        if join {
            query.push_str(
                r#"
                JOIN "Cliente" cli ON c."idCliente" = cli.id
                JOIN "Agencia" a ON c."idAgencia" = a.id
                "#
            );
        }

        query.push_str(" WHERE c.id = $1 LIMIT 1");

        let account = sqlx::query_as::<_, AccountEntity>(&query)
            .bind(id)
            .fetch_optional(database::db())
            .await?;

        Ok(account)
    }

    pub async fn find_all(query: IQueryFindAllAccounts) -> Result<Vec<AccountEntity>, Error> {
        let accounts = sqlx::query_as::<_, AccountEntity>(
            r#"
            SELECT 
                c.id AS id,
                c.numero AS numero,
                c.tipo AS tipo,
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" as "dataDeAtualizacao",
                json_build_object(
                'id', cli.id,
                'nome', cli.nome,
                'cpf', cli.cpf,
                            'dataDeNascimento', cli."dataDeNascimento",
                'telefone', cli.telefone,
                'email', cli.email,
                'dataDeCriacao', cli."dataDeCriacao",
                'dataDeAtualizacao', cli."dataDeAtualizacao"
                ) AS cliente,
                json_build_object(
                'id', a.id,
                'nome', a.nome,
                'numero', a.numero,
                'telefone', a.telefone,
                'dataDeCriacao', a."dataDeCriacao",
                'dataDeAtualizacao', a."dataDeAtualizacao"
                ) AS agencia
            FROM "Conta" c
            JOIN "Cliente" cli ON c."idCliente" = cli.id
            JOIN "Agencia" a ON c."idAgencia" = a.id
            WHERE cli.cpf = $1
            "#
        )
        .bind(query.cpf)
        .fetch_all(database::db())
        .await;

        match accounts {
            Ok(accounts) => Ok(accounts),
            Err(err) => Err(err)
        }
    }

    pub async fn add_balance(id: &str, value: f64, tx: &mut sqlx::Transaction<'_, sqlx::Postgres>) -> Result<(), Error> {
        let id = Uuid::parse_str(id)
            .map_err(|_| Error::Decode("Invalid UUID format".into()))?;

        sqlx::query(
            r#"
            UPDATE "Conta"
            SET saldo = saldo + $1
            WHERE id = $2
            "#
        )
        .bind(value)
        .bind(id)
        .execute(tx.as_mut())
        .await?;

        Ok(())
    }

    pub async fn remove_balance(id: &str, value: f64, tx: &mut sqlx::Transaction<'_, sqlx::Postgres>) -> Result<(), Error> {
        let id = Uuid::parse_str(id)
            .map_err(|_| Error::Decode("Invalid UUID format".into()))?;

        sqlx::query(
            r#"
            UPDATE "Conta"
            SET saldo = saldo - $1
            WHERE id = $2
            "#
        )
        .bind(value)
        .bind(id)
        .execute(tx.as_mut())
        .await?;

        Ok(())
    }
}
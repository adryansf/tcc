use super::entity::BranchEntity;
use crate::database;
use sqlx::Error;
use uuid::Uuid;

pub struct BranchRepository {
}

impl BranchRepository {
    pub async fn find_by_id(id: &str) -> Result<Option<BranchEntity>, Error> {
        let id = Uuid::parse_str(id)
            .map_err(|_| Error::Decode("Invalid UUID format".into()))?;

        let branch = sqlx::query_as::<_, BranchEntity>(
            r#"
            SELECT 
                *
            FROM "Agencia" a
            WHERE a.id = $1
            LIMIT 1
            "#
        )
        .bind(id)
        .fetch_optional(database::db())
        .await;

        match branch {
            Ok(branch) => Ok(branch),
            Err(err) => Err(err),
        }
    }

    pub async fn find_all() -> Result<Vec<BranchEntity>, Error> {
        let branches = sqlx::query_as::<_, BranchEntity>(
            r#"
            SELECT 
                *
            FROM "Agencia"
            "#
        )
        .fetch_all(database::db())
        .await;

        match branches {
            Ok(branches) => Ok(branches),
            Err(err) => Err(err),
        }
    }
}
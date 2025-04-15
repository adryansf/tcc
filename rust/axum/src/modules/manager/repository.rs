use super::entity::ManagerEntity;
use crate::database;
use sqlx::Error;
pub struct ManagerRepository;

impl ManagerRepository {
	pub async fn find_by_email(email: &str) -> Result<Option<ManagerEntity>, Error> {
		let manager = sqlx::query_as::<_, ManagerEntity>(
			r#"
			SELECT * FROM "Gerente" WHERE email = $1 LIMIT 1
			"#
		)
		.bind(email)
		.fetch_optional(database::db())
		.await;

		match manager {
			Ok(manager) => Ok(manager),
			Err(err) => Err(err),
		}
	}

	pub async fn find_all(quantidade: i32) -> Result<Vec<ManagerEntity>, Error> {
		let managers = sqlx::query_as::<_, ManagerEntity>(
			r#"
			SELECT * FROM "Gerente" LIMIT $1
			"#
		)
    .bind(quantidade)
    .fetch_all(database::db())
    .await;

    match managers {
      Ok(managers) => Ok(managers),
      Err(err) => Err(err),
    }
	}
}
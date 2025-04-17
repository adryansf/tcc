use super::entity::AddressEntity;
use sqlx::Error;
use uuid::Uuid;
use crate::database;

pub struct ICreateAddressData {
    pub logradouro: String,
    pub numero: String,
    pub bairro: String,
    pub cidade: String,
    pub uf: String,
    pub complemento: Option<String>,
    pub cep: String,
    pub id_cliente: Uuid,
}

pub struct AddressRepository;

impl AddressRepository {
    pub async fn create(
        data: ICreateAddressData,
    ) -> Result<AddressEntity, Error> {
        let mut transaction:sqlx::Transaction<'_, sqlx::Postgres> = database::db().begin().await?;

        let address = sqlx::query_as::<_, AddressEntity>(
            r#"
            INSERT INTO "Endereco" (logradouro, numero, bairro, cidade, uf, cep, "idCliente", complemento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            "#
        )
        .bind(&data.logradouro)
        .bind(&data.numero)
        .bind(&data.bairro)
        .bind(&data.cidade)
        .bind(&data.uf)
        .bind(&data.cep)
        .bind(&data.id_cliente)
        .bind(&data.complemento)
        .fetch_one(&mut *transaction)
        .await;

        match address {
            Ok(address) => {
                // Commit da transação
                transaction.commit().await?;
                Ok(address)
            }
            Err(err) => {
                // Rollback em caso de erro
                transaction.rollback().await?;
                Err(err)
            }
        }
    }

    pub async fn find_by_id_client(id_client: &str) -> Result<Option<AddressEntity>, Error> {
        let id_client = Uuid::parse_str(id_client)
            .map_err(|_| Error::Decode("Invalid UUID format".into()))?;

        let address = sqlx::query_as::<_, AddressEntity>(
            r#"
            SELECT * FROM "Endereco" e WHERE e."idCliente" = $1
            "#
        )
        .bind(id_client)
        .fetch_optional(database::db())
        .await;

        match address {
            Ok(address) => Ok(address),
            Err(err) => Err(err),
        }
    }
}
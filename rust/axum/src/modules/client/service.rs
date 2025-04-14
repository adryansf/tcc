use super::repository::ClientRepository;
use super::entity::ClientEntity;
use serde_json::{json, Value};

pub struct ClientService {
}

impl ClientService{
    pub async fn find_by_cpf(cpf: &str) -> Result<ClientEntity, Value> {
        let mut repository = ClientRepository::new().await;
        repository.find_by_cpf(cpf).await.ok_or_else(|| json!({"message": "Deu erro"}))
    }
}

// impl ClientService {
//     pub async fn create(&self, mut data: CreateClientDto) -> Result<ClientEntity, errors::BaseError> {
//         if self.repository.find_by_email(&data.email).await.is_some() {
//             return Err(errors::bad_request_error(&messages::ErrorMessages::Client.BadRequest.EmailNotUnique));
//         }

//         if self.repository.find_by_cpf(&data.cpf).await.is_some() {
//             return Err(errors::bad_request_error(&messages::ErrorMessages::Client.BadRequest.CPFNotUnique));
//         }

//         data.senha = helper::encrypt_password(&data.senha).await?;

//         self.repository.create(data).await.map_err(|_| {
//             errors::internal_server_error(&messages::ErrorMessages::InternalServer)
//         })
//     }

  
// }

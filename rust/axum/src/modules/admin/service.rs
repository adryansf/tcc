use crate::modules::manager::repository::ManagerRepository;
use crate::modules::client::repository::ClientRepository;
use crate::modules::client::entity::ClientEntity;
use crate::modules::manager::entity::ManagerEntity;
use crate::common::errors::base::BaseError;
use crate::common::errors::internal_server::internal_server_error;
use crate::common::messages::error::ErrorMessages;


pub struct AdminService {
}

impl AdminService{
    pub async fn find_all_clients(quantidade: i32) -> Result<Vec<ClientEntity>, BaseError> {
        let clients = ClientRepository::find_all(quantidade).await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        if clients.is_empty() {
            return Ok(Vec::new());
        }

        Ok(clients)
    }

    pub async fn find_all_managers(quantidade: i32) -> Result<Vec<ManagerEntity>, BaseError> {
        let managers = ManagerRepository::find_all(quantidade).await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        if managers.is_empty() {
            return Ok(Vec::new());
        }

        Ok(managers)
    }
}
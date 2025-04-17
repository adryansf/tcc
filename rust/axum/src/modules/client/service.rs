use super::repository::{ClientRepository, ICreateClientData};
use super::entity::ClientEntity;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::errors::base::BaseError;
use crate::common::errors::internal_server::internal_server_error;
use crate::common::errors::not_found::not_found_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::helper::bcrypt;


pub struct ClientService {
}

impl ClientService{
    pub async fn find_by_cpf(cpf: &str) -> Result<ClientEntity, BaseError> {
        ClientRepository::find_by_cpf(cpf).await.unwrap().ok_or_else(|| not_found_error(ErrorMessages::CLIENT_NOT_FOUND, None))
    }

    pub async fn create(data: ICreateClientData) -> Result<ClientEntity, BaseError> {
        // Verificar se já existe um cliente com o mesmo email
        match ClientRepository::find_by_email(&data.email).await {
            Ok(Some(_)) => return Err(bad_request_error(ErrorMessages::CLIENT_BAD_REQUEST_EMAIL_NOT_UNIQUE, None)),
            Ok(None) => (),
            Err(_) => ()
        }

        // Verificar se já existe um cliente com o mesmo CPF
        match ClientRepository::find_by_cpf(&data.cpf).await {
            Ok(Some(_)) => return Err(bad_request_error(ErrorMessages::CLIENT_BAD_REQUEST_CPF_NOT_UNIQUE, None)),
            Ok(None) => (),
            Err(_) => ()
        }

        // Criptografar a senha
        let encrypted_password = bcrypt::encrypt_password(&data.senha)
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        // Atualizar a senha no objeto de entrada
        let mut data = data;
        data.senha = encrypted_password;

        // Criar o cliente
        ClientRepository::create(data).await.map_err(|e| {
            println!("Erro ao criar cliente: {:?}", e);
            internal_server_error(ErrorMessages::INTERNAL_SERVER, None)
        })
    }
}
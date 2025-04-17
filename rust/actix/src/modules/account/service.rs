use super::repository::{AccountRepository, ICreateAccountData, IQueryFindAllAccounts};
use super::entity::AccountEntity;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::errors::base::BaseError;
use crate::common::errors::internal_server::internal_server_error;
use crate::common::errors::unauthorized::unauthorized_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::helper::permission;
use crate::common::enums::role::RoleEnum;
use crate::modules::branch::repository::BranchRepository;
use crate::modules::client::repository::ClientRepository;
use crate::modules::manager::repository::ManagerRepository;
use super::dto::CreateAccountDto;
use crate::modules::auth::interfaces::JwtPayload;
use uuid::Uuid;

pub struct AccountService {
}

impl AccountService {
    pub async fn create(
        data: CreateAccountDto,
        id_client: &str,
        payload: JwtPayload,
    ) -> Result<AccountEntity, BaseError> {
        let mut id_agencia = data.id_agencia;

        if payload.role == RoleEnum::Manager {
            let manager = ManagerRepository::find_by_email(&payload.email).await
                .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

            if let Some(manager) = manager {
                id_agencia = Some(manager.id_agencia);
            }
        }

        if id_agencia.is_none() {
            return Err(bad_request_error(ErrorMessages::ACCOUNT_BAD_REQUEST_BRANCH_REQUIRED, None));
        }

        let branch = BranchRepository::find_by_id(&id_agencia.unwrap().to_string()).await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        if branch.is_none() {
            return Err(bad_request_error(ErrorMessages::ACCOUNT_BAD_REQUEST_BRANCH_NOT_EXISTS, None));
        }

        let mut id_cliente = Uuid::parse_str(id_client)
            .map_err(|_| bad_request_error(ErrorMessages::ACCOUNT_BAD_REQUEST_ID_CLIENT, None))?;

        if payload.role == RoleEnum::Manager {
            if data.id_cliente.is_none() {
                return Err(bad_request_error(ErrorMessages::ACCOUNT_BAD_REQUEST_ID_CLIENT, None));
            }

            let client = ClientRepository::find_by_id(&data.id_cliente.unwrap().to_string()).await
                .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

            if client.is_none() {
                return Err(bad_request_error(ErrorMessages::CLIENT_NOT_FOUND, None));
            }

            id_cliente = data.id_cliente.unwrap();
        }

        let new_account = AccountRepository::create(ICreateAccountData {
            tipo: data.tipo.unwrap().to_string(),
            id_agencia: id_agencia.unwrap(),
            id_cliente,
        }).await.map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        Ok(new_account)
    }

    pub async fn find_all(cpf: &str) -> Result<Vec<AccountEntity>, BaseError> {
        let accounts = AccountRepository::find_all(IQueryFindAllAccounts {
            cpf: cpf.to_string(),
        }).await.map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        Ok(accounts)
    }

    pub async fn find_by_id(
        id: &str,
        id_client: &str,
        role: RoleEnum,
    ) -> Result<AccountEntity, BaseError> {
        let has_permission = permission::has_permission(role, RoleEnum::Manager);

        let account = AccountRepository::find_by_id(id, true).await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?
            .ok_or_else(|| bad_request_error(ErrorMessages::ACCOUNT_NOT_FOUND, None))?;

        if account.id_cliente.unwrap_or_default().to_string() != id_client && !has_permission {
            return Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None));
        }

        Ok(account)
    }
}
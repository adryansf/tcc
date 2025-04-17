use crate::common::enums::role::RoleEnum;
use crate::modules::transaction::dto::CreateTransactionDto;
use crate::modules::transaction::entity::TransactionEntity;
use crate::modules::account::entity::AccountEntity;
use crate::common::errors::{bad_request::bad_request_error, base::BaseError, not_found::not_found_error, unauthorized::unauthorized_error};
use crate::common::messages::error::ErrorMessages;
use crate::modules::account::repository::AccountRepository;
use crate::modules::transaction::repository::TransactionRepository;
use crate::modules::transaction::enums::TransactionType;
use crate::modules::transaction::repository::ICreateTransactionData;
use crate::database;
use std::convert::From;
use bigdecimal::BigDecimal;
use crate::common::errors::internal_server::internal_server_error;
use crate::common::helper::permission;
use uuid::Uuid;

pub struct TransactionService {
}

impl TransactionService {
    pub async fn create(
        data: CreateTransactionDto,
        id_client: String,
    ) -> Result<TransactionEntity, BaseError> {
        let tipo = data.tipo;
        let mut origin_account: Option<AccountEntity> = None;

        if data.id_conta_destino == data.id_conta_origem {
            return Err(bad_request_error(ErrorMessages::ACCOUNT_BAD_REQUEST_SAME_ACCOUNT, None));
        }

        // Verificar se contas existem
        if let Some(id_conta_origem) = data.id_conta_origem {
            origin_account = AccountRepository::find_by_id(&id_conta_origem.to_string(), false)
                .await
                .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

            if origin_account.is_none() {
                return Err(not_found_error(ErrorMessages::ACCOUNT_NOT_FOUND_ORIGIN, None));
            }

            if origin_account.as_ref().unwrap().id_cliente.unwrap().to_string() != id_client {
                return Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None));
            }
        }

        if let Some(id_conta_destino) = data.id_conta_destino {
            let target_account = AccountRepository::find_by_id(&id_conta_destino.to_string(), false)
                .await
                .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

            if target_account.is_none() {
                return Err(not_found_error(ErrorMessages::ACCOUNT_NOT_FOUND_TARGET, None));
            }
        }

        if (tipo == TransactionType::Transfer || tipo == TransactionType::Withdrawal) 
            && origin_account.is_some() 
            && origin_account.as_ref().unwrap().saldo < Some(BigDecimal::from(data.valor as i64))
        {
            return Err(bad_request_error(ErrorMessages::ACCOUNT_BAD_REQUEST_BALANCE_NOT_ENOUGH, None));
        }

        // Iniciar transação
        let mut tx: sqlx::Transaction<'_, sqlx::Postgres> = database::db().begin()
            .await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        match tipo {
            TransactionType::Deposit => {
                AccountRepository::add_balance(&data.id_conta_destino.unwrap().to_string(), data.valor, &mut tx)
                    .await
                    .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;
            }
            TransactionType::Transfer => {
                AccountRepository::remove_balance(&data.id_conta_origem.unwrap().to_string(), data.valor, &mut tx)
                    .await
                    .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;
                AccountRepository::add_balance(&data.id_conta_destino.unwrap().to_string(), data.valor, &mut tx)
                    .await
                    .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;
            }
            TransactionType::Withdrawal => {
                AccountRepository::remove_balance(&data.id_conta_origem.unwrap().to_string(), data.valor, &mut tx)
                    .await
                    .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;
            }
        };


        let new_transaction = TransactionRepository::create(
            ICreateTransactionData {
                tipo: tipo.to_string(),
                valor: data.valor,
                id_conta_origem: data.id_conta_origem,
                id_conta_destino: data.id_conta_destino,
            },
            &mut tx
        ).await
        .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        tx.commit()
            .await
            .map(|_| new_transaction)
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))
    }

    pub async fn find_all(
        id_account: Uuid,
        id_client: String,
        role: RoleEnum,
    ) -> Result<Vec<TransactionEntity>, BaseError> {
        let permission = permission::has_permission(role, RoleEnum::Manager);

        let account = AccountRepository::find_by_id(&id_account.to_string(), false)
            .await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        if account.is_none() {
            return Err(not_found_error(ErrorMessages::ACCOUNT_NOT_FOUND, None));
        }

        let account = account.unwrap();
        if account.id_cliente.unwrap().to_string() != id_client && !permission {
            return Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None));
        }

        let transactions = TransactionRepository::find_all(&id_account.to_string())
            .await
            .map_err(|_| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        if transactions.is_empty() {
            return Ok(Vec::new());
        }

        Ok(transactions)
    }
} 
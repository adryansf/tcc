use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;
use crate::modules::transaction::enums::TransactionType;
use validator::{ValidationError, ValidationErrors};

fn validate_transaction_fields(tipo: &TransactionType, id_conta_origem: &Option<Uuid>, id_conta_destino: &Option<Uuid>) -> Result<(), ValidationErrors> {
    let mut errors = ValidationErrors::new();
    
    match tipo {
        TransactionType::Deposit => {
            if id_conta_destino.is_none() {
                errors.add("idContaDestino", ValidationError::new("required")
                    .with_message("O campo idContaDestino é obrigatório para depósito.".into()));
            }
        },
        TransactionType::Withdrawal => {
            if id_conta_origem.is_none() {
                errors.add("idContaOrigem", ValidationError::new("required")
                    .with_message("O campo idContaOrigem é obrigatório para saque.".into()));
            }
        },
        TransactionType::Transfer => {
            if id_conta_origem.is_none() || id_conta_destino.is_none() {
                errors.add("idContaOrigem", ValidationError::new("required")
                    .with_message("Os campos idContaOrigem e idContaDestino são obrigatórios para transferência.".into()));
            }
        },
    }
    
    if errors.is_empty() {
        Ok(())
    } else {
        Err(errors)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateTransactionDto {
    #[validate(range(min = 0.01, message = "O campo valor deve ser um valor positivo."))]
    pub valor: f64,
    pub tipo: TransactionType,
    pub id_conta_origem: Option<Uuid>,
    pub id_conta_destino: Option<Uuid>,
}

impl CreateTransactionDto {
    pub fn validate_transaction(&self) -> Result<(), ValidationErrors> {
        validate_transaction_fields(&self.tipo, &self.id_conta_origem, &self.id_conta_destino)
    }
} 
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TransactionType {
    #[serde(rename = "DEPOSITO")]
    Deposit,
    #[serde(rename = "SAQUE")]
    Withdrawal,
    #[serde(rename = "TRANSFERENCIA")]
    Transfer,
}

impl fmt::Display for TransactionType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TransactionType::Deposit => write!(f, "DEPOSITO"),
            TransactionType::Withdrawal => write!(f, "SAQUE"),
            TransactionType::Transfer => write!(f, "TRANSFERENCIA"),
        }
    }
} 
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum AccountTypeEnum {
    #[serde(rename = "CORRENTE")]
    Corrente,
    #[serde(rename = "POUPANCA")]
    Poupanca,
}

impl fmt::Display for AccountTypeEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AccountTypeEnum::Corrente => write!(f, "CORRENTE"),
            AccountTypeEnum::Poupanca => write!(f, "POUPANCA"),
        }
    }
} 
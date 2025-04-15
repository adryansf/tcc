#[allow(unused_imports)]
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone, Copy)]
pub enum RoleEnum {
    Client,
    Manager,
}

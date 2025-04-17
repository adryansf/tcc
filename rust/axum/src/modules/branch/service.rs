use super::repository::BranchRepository;
use super::entity::BranchEntity;
use crate::common::errors::internal_server::internal_server_error;
use crate::common::errors::base::BaseError;
use crate::common::messages::error::ErrorMessages;

pub struct BranchService {
}

impl BranchService{
    pub async fn find_all() -> Result<Vec<BranchEntity>, BaseError> {
        match BranchRepository::find_all().await {
            Ok(branches) => Ok(branches),
            Err(_err) => Err(internal_server_error(ErrorMessages::INTERNAL_SERVER, None))
        }
    }
}
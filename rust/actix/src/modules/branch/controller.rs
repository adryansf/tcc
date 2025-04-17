use actix_web::web::Json;

use crate::modules::branch::entity::BranchEntity;
use crate::common::errors::base::BaseError;
use super::service::BranchService;

pub struct BranchController;

impl BranchController {
    pub async fn find_all() -> Result<Json<Vec<BranchEntity>>, BaseError> {
        match BranchService::find_all().await {
            Ok(branches) => Ok(Json(branches)),
            Err(err) => Err(err),
        }
    }
}

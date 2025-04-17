use axum::{
    response::IntoResponse,
    Json,
};

use super::service::BranchService;

pub struct BranchController{
}


impl BranchController {
    pub async fn find_all() -> impl IntoResponse {
        match BranchService::find_all().await {
            Ok(branches) => Json(branches).into_response(),
            Err(err) => err.into_response(),
        }
    }
}

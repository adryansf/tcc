use axum::{
    extract::Path,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use super::service::ClientService;
use super::dto::find_by_cpf_client_dto::FindByCPFClientDto;

pub struct ClientController;

impl ClientController {
    // pub async fn create(
    //     Json(mut dto): Json<CreateClientDto>,
    // ) -> impl IntoResponse {
    //     dto.transform();

    //     if let Err(err) = helper::validate(&dto) {
    //         let bad_request = errors::bad_request_error(&messages::ErrorMessages::BadRequest, &err);
    //         return (StatusCode::BAD_REQUEST, Json(bad_request)).into_response();
    //     }

    //     match self.service.create(dto).await {
    //         Ok(_) => StatusCode::CREATED.into_response(),
    //         Err(err) => (err.status_code, Json(err)).into_response(),
    //     }
    // }

    pub async fn find_by_cpf(
        Path(cpf): Path<String>,
    ) -> impl IntoResponse {
        let mut dto = FindByCPFClientDto { cpf };
        dto.transform();

        // if let Err(err) = helper::validate(&dto) {
        //     let bad_request = errors::bad_request_error(&messages::ErrorMessages::BadRequest, &err);
        //     return (StatusCode::BAD_REQUEST, Json(bad_request)).into_response();
        // }

        match ClientService::find_by_cpf(&dto.cpf).await {
            Ok(client) => Json(client).into_response(),
            Err(err) => (StatusCode::BAD_REQUEST, Json(err)).into_response(),
        }
    }
}

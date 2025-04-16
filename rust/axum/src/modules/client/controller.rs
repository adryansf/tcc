use axum::{
    extract::Path,
    http::StatusCode,
    response::IntoResponse,
    Json
};
use validator::Validate;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;

use super::repository::ICreateClientData;
use super::service::ClientService;
use super::dto::FindByCPFClientDto;
use super::dto::CreateClientDto;

pub struct ClientController{
}



impl ClientController {
    pub async fn create(
        Json(mut dto): Json<CreateClientDto>,
    ) -> impl IntoResponse {
        dto.transform();

        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
        }

        match ClientService::create(ICreateClientData{
            nome: dto.nome.to_string(),
            cpf: dto.cpf.to_string(),
            telefone: dto.telefone.to_string(),
            data_de_nascimento: dto.data_de_nascimento,
            email: dto.email.to_string(),
            senha: dto.senha.to_string(),
        }).await {
            Ok(_) => StatusCode::CREATED.into_response(),
            Err(err) => err.into_response(),
        }
    }

    pub async fn find_by_cpf(
        Path(cpf): Path<String>
    ) -> impl IntoResponse {
        let mut dto = FindByCPFClientDto { cpf };
        dto.transform();

        match dto.validate() {
            Ok(_) => {},
            Err(err) => {
                return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
            }
        }
        
        match ClientService::find_by_cpf(&dto.cpf).await {
            Ok(client) => Json(client).into_response(),
            Err(err) => err.into_response(),
        }
    }
}

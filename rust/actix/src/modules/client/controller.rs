use actix_web::{web, HttpResponse};
use validator::Validate;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::errors::base::BaseError;

use super::repository::ICreateClientData;
use super::service::ClientService;
use super::dto::FindByCPFClientDto;
use super::dto::CreateClientDto;

pub struct ClientController;

impl ClientController {
    pub async fn create(
        dto: web::Json<CreateClientDto>,
    ) -> Result<HttpResponse, BaseError> {
        let mut dto = dto.into_inner();
        dto.transform();

        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        match ClientService::create(ICreateClientData{
            nome: dto.nome.to_string(),
            cpf: dto.cpf.to_string(),
            telefone: dto.telefone.to_string(),
            data_de_nascimento: dto.data_de_nascimento,
            email: dto.email.to_string(),
            senha: dto.senha.to_string(),
        }).await {
            Ok(_) => Ok(HttpResponse::Created().finish()),
            Err(err) => Err(err),
        }
    }

    pub async fn find_by_cpf(
        cpf: web::Path<String>
    ) -> Result<HttpResponse, BaseError> {
        let mut dto = FindByCPFClientDto { cpf: cpf.into_inner() };
        dto.transform();

        match dto.validate() {
            Ok(_) => {},
            Err(err) => {
                return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
            }
        }
        
        match ClientService::find_by_cpf(&dto.cpf).await {
            Ok(client) => Ok(HttpResponse::Ok().json(client)),
            Err(err) => Err(err),
        }
    }
}

use actix_web::{web, HttpResponse};
use validator::Validate;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use super::dto::CreateAddressDto;
use super::repository::ICreateAddressData;
use super::service::AddressService;
use crate::modules::auth::interfaces::JwtPayload;
use crate::common::errors::base::BaseError;
use uuid::Uuid;

pub struct AddressController;

impl AddressController {
    pub async fn create(
        jwt_payload: web::ReqData<JwtPayload>,
        dto: web::Json<CreateAddressDto>,
    ) -> Result<HttpResponse, BaseError> {
        let mut dto = dto.into_inner();
        dto.transform();

        if let Err(err) = dto.validate() {
            return Err(bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)));
        }

        let id_client = Uuid::parse_str(&jwt_payload.id).unwrap();

        let data = ICreateAddressData {
            logradouro: dto.logradouro,
            numero: dto.numero,
            bairro: dto.bairro,
            cidade: dto.cidade,
            uf: dto.uf,
            complemento: dto.complemento,
            cep: dto.cep,
            id_cliente: id_client,
        };

        match AddressService::create(data, id_client).await {
            Ok(_) => Ok(HttpResponse::Created().finish()),
            Err(err) => Err(err),
        }
    }
}
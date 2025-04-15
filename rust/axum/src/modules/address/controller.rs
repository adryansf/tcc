use axum::{
    extract::{Json, Extension},
    http::StatusCode,
    response::IntoResponse,
};
use validator::Validate;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use super::dto::CreateAddressDto;
use super::repository::ICreateAddressData;
use super::service::AddressService;
use crate::modules::auth::interfaces::JwtPayload;
use uuid::Uuid;

pub struct AddressController;

impl AddressController {
    pub async fn create(
        Extension(jwt_payload): Extension<JwtPayload>,
        Json(mut dto): Json<CreateAddressDto>,
    ) -> impl IntoResponse {
        dto.transform();

        if let Err(err) = dto.validate() {
            return bad_request_error(ErrorMessages::BAD_REQUEST, Some(err)).into_response();
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
            id_cliente:id_client,
        };

        match AddressService::create(data, id_client).await {
            Ok(_) => StatusCode::CREATED.into_response(),
            Err(err) => err.into_response(),
        }
    }
}
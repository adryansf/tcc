use super::repository::{AddressRepository, ICreateAddressData};
use super::entity::AddressEntity;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::errors::base::BaseError;
use crate::common::messages::error::ErrorMessages;
use uuid::Uuid;
use crate::modules::client::repository::ClientRepository;
pub struct AddressService;

impl AddressService {
    pub async fn create(
        data: ICreateAddressData,
        id_client: Uuid,
    ) -> Result<AddressEntity, BaseError> {
        let client = ClientRepository::find_by_id(&id_client.to_string()).await.unwrap();

        if client.is_none() {
            return Err(bad_request_error(ErrorMessages::CLIENT_NOT_FOUND, None));
        }

        let exists_address = AddressRepository::find_by_id_client(&id_client.to_string()).await.unwrap();

        if exists_address.is_some() {
            return Err(bad_request_error(ErrorMessages::ADDRESS_BAD_REQUEST_ALREADY_EXISTS, None));
        }

        AddressRepository::create(data)
            .await
            .map_err(|_| bad_request_error(ErrorMessages::INTERNAL_SERVER, None))
    }
}
use crate::modules::client::repository::ClientRepository;
use crate::modules::manager::repository::ManagerRepository;
use crate::common::errors::base::BaseError;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::errors::internal_server::internal_server_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::enums::role::RoleEnum;
use crate::common::helper::jwt::generate_jwt;
use crate::common::helper::bcrypt::is_password_correct;
use crate::modules::auth::interfaces::JwtPayload;
use super::dto::{LoginAuthDto, LoginAuthClientOutputDto, LoginAuthManagerOutputDto};
use chrono::{DateTime, Utc};

pub struct AuthService {
}

impl AuthService {
    pub async fn login_client(
        data: LoginAuthDto,
    ) -> Result<LoginAuthClientOutputDto, BaseError> {

        
        let client = ClientRepository::find_by_email(&data.email).await
        .unwrap()
        .ok_or_else(|| bad_request_error(ErrorMessages::AUTH_BAD_REQUEST, None))?;
        

        if !is_password_correct(&data.senha, &client.senha) {
            return Err(bad_request_error(ErrorMessages::AUTH_BAD_REQUEST, None));
        }

        let payload = JwtPayload {
            id: client.id.to_string(),
            email: client.email.clone(),
            cpf: client.cpf.clone(),
            role: RoleEnum::Client,
        };

        let token = generate_jwt(payload)
            .map_err(|e| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        let datetime: DateTime<Utc> = token.expires_in.into();
        Ok(LoginAuthClientOutputDto {
            token: token.token,
            usuario: client,
            expira_em: datetime.to_rfc3339(),
        })
    }

    pub async fn login_manager(
        data: LoginAuthDto,
    ) -> Result<LoginAuthManagerOutputDto, BaseError> {
        let manager = ManagerRepository::find_by_email(&data.email).await
        .unwrap()
        .ok_or_else(|| bad_request_error(ErrorMessages::AUTH_BAD_REQUEST, None))?;

        if !is_password_correct(&data.senha, &manager.senha) {
            return Err(bad_request_error(ErrorMessages::AUTH_BAD_REQUEST, None));
        }

        let token = generate_jwt(JwtPayload {
            id: manager.id.to_string(),
            email: manager.email.clone(),
            cpf: manager.cpf.clone(),
            role: RoleEnum::Manager,
        }).map_err(|e| internal_server_error(ErrorMessages::INTERNAL_SERVER, None))?;

        let datetime: DateTime<Utc> = token.expires_in.into();
        Ok(LoginAuthManagerOutputDto {
            token: token.token,
            usuario: manager,
            expira_em: datetime.to_rfc3339(),
        })
    }
} 
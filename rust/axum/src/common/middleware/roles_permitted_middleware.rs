use axum::{
  http::Request,
  middleware::Next,
  response::Response,
  body::Body,
};
use crate::common::enums::role::RoleEnum;
use crate::modules::auth::interfaces::JwtPayload;
use crate::common::errors::unauthorized::unauthorized_error;
use crate::common::messages::error::ErrorMessages;
use crate::common::errors::base::BaseError;

pub async fn roles_permitted_middleware(
  req: Request<Body>,
  next: Next,
  permitted_roles: Vec<RoleEnum>,
) -> Result<Response, BaseError> {
  // Obtém o payload JWT do request
  let jwt_payload = req
      .extensions()
      .get::<JwtPayload>()
      .ok_or(unauthorized_error(ErrorMessages::UNAUTHORIZED, None))?;

  // Verifica se a role do usuário está entre as permitidas
  if !permitted_roles.contains(&jwt_payload.role) {
      return Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None));
  }

  // Se a role for permitida, continua o processamento
  Ok(next.run(req).await)
}
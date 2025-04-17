use axum::{
    http::Request,
    middleware::Next,
    response::Response,
    body::Body,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use std::env;
use crate::common::errors::base::BaseError;
use crate::common::errors::unauthorized::unauthorized_error;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use crate::modules::auth::interfaces::JwtPayload;

pub async fn auth_middleware(
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, BaseError> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|header| header.to_str().ok())
        .ok_or_else(|| unauthorized_error(ErrorMessages::UNAUTHORIZED, None))?;

    let parts: Vec<&str> = auth_header.split_whitespace().collect();
    if parts.len() != 2 || parts[0] != "Bearer" {
        return Err(bad_request_error(ErrorMessages::MIDDLEWARE_AUTH_BAD_REQUEST_UNFORMATTED, None));
    }

    let token = parts[1];
    let secret = env::var("JWT_SECRET").map_err(|_| {
        unauthorized_error(ErrorMessages::UNAUTHORIZED, None)
    })?;

    let token_data = decode::<JwtPayload>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    ).map_err(|_| unauthorized_error(ErrorMessages::UNAUTHORIZED, None))?;

    req.extensions_mut().insert(token_data.claims);

    Ok(next.run(req).await)
} 
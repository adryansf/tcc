use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures::future::{ready, Ready, Future};
use jsonwebtoken::{decode, DecodingKey, Validation};
use std::env;
use std::pin::Pin;
use std::task::{Context, Poll};
use crate::common::errors::unauthorized::unauthorized_error;
use crate::common::errors::bad_request::bad_request_error;
use crate::common::messages::error::ErrorMessages;
use crate::modules::auth::interfaces::JwtPayload;

pub struct AuthMiddleware;

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddlewareService<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddlewareService { service }))
    }
}

pub struct AuthMiddlewareService<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>>>>;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let auth_header = req.headers().get("Authorization")
            .and_then(|header| header.to_str().ok())
            .ok_or_else(|| unauthorized_error(ErrorMessages::UNAUTHORIZED, None).into());

        let token = match auth_header {
            Ok(header) => {
                let parts: Vec<&str> = header.split_whitespace().collect();
                if parts.len() != 2 || parts[0] != "Bearer" {
                    return Box::pin(async move {
                        Err(bad_request_error(ErrorMessages::MIDDLEWARE_AUTH_BAD_REQUEST_UNFORMATTED, None).into())
                    });
                }
                parts[1].to_string()
            },
            Err(err) => return Box::pin(async move { Err(err) }),
        };

        let secret = match env::var("JWT_SECRET") {
            Ok(secret) => secret,
            Err(_) => return Box::pin(async move {
                Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None).into())
            }),
        };

        let token_data = match decode::<JwtPayload>(
            &token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        ) {
            Ok(data) => data,
            Err(_) => return Box::pin(async move {
                Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None).into())
            }),
        };

        let req = req;
        req.extensions_mut().insert(token_data.claims);

        let fut = self.service.call(req);
        Box::pin(async move {
            let res = fut.await?;
            Ok(res)
        })
    }
} 
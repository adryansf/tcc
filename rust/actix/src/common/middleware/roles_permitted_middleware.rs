use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures::future::{ready, Ready, Future};
use std::pin::Pin;
use std::task::{Context, Poll};
use crate::common::enums::role::RoleEnum;
use crate::modules::auth::interfaces::JwtPayload;
use crate::common::errors::unauthorized::unauthorized_error;
use crate::common::messages::error::ErrorMessages;

pub struct RolesPermittedMiddleware {
    permitted_roles: Vec<RoleEnum>,
}

impl RolesPermittedMiddleware {
    pub fn new(permitted_roles: Vec<RoleEnum>) -> Self {
        Self { permitted_roles }
    }
}

impl<S, B> Transform<S, ServiceRequest> for RolesPermittedMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = RolesPermittedMiddlewareService<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RolesPermittedMiddlewareService {
            service,
            permitted_roles: self.permitted_roles.clone(),
        }))
    }
}

pub struct RolesPermittedMiddlewareService<S> {
    service: S,
    permitted_roles: Vec<RoleEnum>,
}

impl<S, B> Service<ServiceRequest> for RolesPermittedMiddlewareService<S>
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
        let permitted_roles = self.permitted_roles.clone();
        let role_check = req.extensions().get::<JwtPayload>()
            .map(|payload| 
                permitted_roles.contains(&payload.role)
            )
            .unwrap_or(false);

        if !role_check {
            return Box::pin(async move {
                Err(unauthorized_error(ErrorMessages::UNAUTHORIZED, None).into())
            });
        }

        let fut = self.service.call(req);
        Box::pin(async move {
            let res = fut.await?;
            Ok(res)
        })
    }
}
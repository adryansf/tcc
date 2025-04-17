use std::env;
use std::time::{SystemTime, UNIX_EPOCH, Duration};
use jsonwebtoken::{encode, Header, EncodingKey, Algorithm};
use crate::modules::auth::interfaces::JwtPayload;

#[derive(Debug)]
pub struct JwtReturn {
	pub token: String,
	pub expires_in: SystemTime,
}

pub fn generate_jwt(payload: JwtPayload) -> Result<JwtReturn, Box<dyn std::error::Error>> {
	let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default_secret".to_string());
	let expires_in = env::var("JWT_EXPIRES_IN")
		.unwrap_or_else(|_| "86400".to_string())
		.parse::<u64>()
		.unwrap_or(86400);

	let exp = SystemTime::now() + Duration::from_secs(expires_in);
	let exp_timestamp = exp.duration_since(UNIX_EPOCH)?.as_secs();

	let claims = serde_json::json!({
		"cpf": payload.cpf,
		"email": payload.email,
		"id": payload.id,
		"role": payload.role,
		"exp": exp_timestamp
	});

	let token = encode(
		&Header::new(Algorithm::HS256),
		&claims,
		&EncodingKey::from_secret(secret.as_bytes()),
	)?;

	Ok(JwtReturn {
		token,
		expires_in: exp,
	})
}
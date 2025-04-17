use bcrypt::{hash, verify, DEFAULT_COST};

/// Criptografa uma senha usando bcrypt
pub fn encrypt_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, DEFAULT_COST)
}

/// Verifica se a senha fornecida corresponde à senha criptografada
pub fn is_password_correct(password_to_compare: &str, encrypted_password: &str) -> bool {
    verify(password_to_compare, encrypted_password).unwrap_or(false)
}

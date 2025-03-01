import bcrypt

def encrypt_password(password: str) -> str:
    salts = bcrypt.gensalt(12)
    return bcrypt.hashpw(password.encode('utf-8'), salts).decode('utf-8')


def is_password_correct(password_to_compare: str, encrypted_password: str) -> bool:
    return bcrypt.checkpw(password_to_compare.encode('utf-8'), encrypted_password.encode('utf-8'))

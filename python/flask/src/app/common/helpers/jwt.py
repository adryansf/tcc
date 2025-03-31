from jwt import encode, decode
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from os import getenv
import uuid

# Ler .env apenas se ENV for development
ENV = getenv('ENV', 'DEVELOPMENT').upper()
if ENV != 'PRODUCTION':
    load_dotenv()
EXPIRES_IN = int(getenv('JWT_EXPIRES_IN')) or 86400
SECRET_KEY = getenv("JWT_SECRET")
ALGORITHM = "HS256"  # Algoritmo de assinatura

def generate_jwt(payload: dict) -> tuple[str, datetime]:
    exp = datetime.now(tz=timezone.utc) + timedelta(seconds=EXPIRES_IN)
    payload['exp'] = exp

    # Convertendo UUIDs para string
    for key, value in payload.items():
        if isinstance(value, uuid.UUID):
            payload[key] = str(value)

    token = encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return token, exp

def verify_jwt(token):
    payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload
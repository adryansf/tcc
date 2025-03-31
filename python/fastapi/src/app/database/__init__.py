from os import getenv
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Ler .env apenas se ENV for development
ENV = getenv('ENV', 'DEVELOPMENT').upper()
if ENV != 'PRODUCTION':
    load_dotenv()

DATABASE_URL = f"postgresql://{getenv('DB_USER')}:{getenv('DB_PASSWORD')}@{getenv('DB_HOST')}:{getenv('DB_PORT')}/{getenv('DB_NAME')}"

db = create_engine(DATABASE_URL, pool_size=100, max_overflow=0)
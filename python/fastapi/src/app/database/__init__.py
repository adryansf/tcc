from os import getenv
from dotenv import load_dotenv
import psycopg

# Ler .env apenas se ENV for development
if getenv('ENV') == 'development':
    load_dotenv()

db = psycopg.connect(
  host=getenv("DB_HOST"),
  dbname=getenv("DB_NAME"),
  user=getenv("DB_USER"),
  password=getenv("DB_PASSWORD"),
  port=getenv("DB_PORT")
)
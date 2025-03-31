from dotenv import load_dotenv
from app import App
from server import Server
import os

# Ler .env apenas se ENV for development
ENV = os.getenv('ENV', 'DEVELOPMENT').upper()
if ENV != 'PRODUCTION':
    load_dotenv()

PORT = int(os.getenv("SERVER_PORT", 3333))
DEBUG = True if ENV.upper() == "DEVELOPMENT" else False

server = Server(PORT, DEBUG, env=ENV)
app = App(server)

app.start()


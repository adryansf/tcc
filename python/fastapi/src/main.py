from dotenv import load_dotenv
from app import App
from server import Server
import os

# Ler .env apenas se ENV for development
ENV = os.getenv('ENV', 'PRODUCTION').upper()
if ENV  != 'PRODUCTION':
    load_dotenv()

PORT = int(os.getenv("SERVER_PORT", 3333))

server = Server(PORT)
app = App(server)

app.start()


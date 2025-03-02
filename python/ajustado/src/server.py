from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

class Server:
    def __init__(self, port: int):
        self._server = FastAPI()
        self._port = port
        
    def enable_cors(self):
        self._server.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def use(self, *handlers):
        for handler in handlers:
            self._server.before_request(handler)

    def start(self):
        uvicorn.run(self._server, host='0.0.0.0', port=self._port)


    @property
    def server(self):
        return self._server

    @property
    def exception_handler(self):
        return self._server.exception_handler;

    def register_route(self, router:APIRouter):
        return self._server.include_router(router)

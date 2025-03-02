from server import Server

# Modules
from app.modules import modules
from app.common.handlers import register_error_handlers

class App:
    def __init__(self, server: Server):
        self._server = server

    def middlewares(self):
        self._server.enable_cors()
        register_error_handlers(self._server)

    def load_modules(self):
        for module in modules:
            self._server.register_route(module().router)


    def start(self):
        self.middlewares()
        self.load_modules()
        self._server.start()

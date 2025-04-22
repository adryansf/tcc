from server import Server
from app.common.errors import InternalServerError

# Modules
from app.modules import modules
from app.common.handlers import register_error_handlers
from flask import jsonify

class App:
    def __init__(self, server: Server):
        self._server = server

    def middlewares(self):
        self._server.enable_cors()
        register_error_handlers(self._server)
        
        @self._server.server.before_request
        def handle_unhandled_errors():
            try:
                return None
            except Exception as e:
                error = InternalServerError()
                return jsonify(error.toJSON()), error.statusCode

    def load_modules(self):
        for module in modules:
            self._server.register_route(module().router.blueprint)

    def start(self):
        self.middlewares()
        self.load_modules()
        self._server.start()

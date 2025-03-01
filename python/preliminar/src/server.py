from flask import Flask
from flask import Blueprint
from waitress import serve


class Server:
    def __init__(self, port: int, debug: bool = False, env: str = 'PRODUCTION'):
        self._server = Flask(__name__)
        self._port = port
        self._debug=debug
        self._env = env

    def use(self, *handlers):
        for handler in handlers:
            self._server.before_request(handler)

    def start(self):
        if self._env == "PRODUCTION":
            print(f"Servidor Rodando na porta {self._port}")
            serve(self._server, host='0.0.0.0', port=self._port)
        else:
            self._server.run(port=self._port, debug=self._debug)

    @property
    def server(self):
        return self._server

    @property
    def errorhandler(self):
        return self._server.errorhandler;

    def register_route(self, blueprint: Blueprint):
        return self._server.register_blueprint(blueprint)

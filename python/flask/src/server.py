from flask import Flask
from flask import Blueprint
from flask_cors import CORS
from gunicorn.app.base import BaseApplication
from gevent import monkey, pywsgi
monkey.patch_all()


class Server:
    def __init__(self, port: int, debug: bool = False, env: str = 'PRODUCTION'):
        self._server = Flask(__name__)
        self._port = port
        self._debug=debug
        self._env = env
        
    def enable_cors(self):
        CORS(self._server)

    def use(self, *handlers):
        for handler in handlers:
            self._server.before_request(handler)

    def start(self):
        if self._env == "PRODUCTION":
            print(f"Servidor Rodando na porta {self._port}")
            pywsgi.WSGIServer(("0.0.0.0", self._port), self._server).serve_forever()
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


class GunicornApp(BaseApplication):
    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super().__init__()

    def load_config(self):
        for key, value in self.options.items():
            self.cfg.set(key, value)

    def load(self):
        return self.application

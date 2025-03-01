from flask import Blueprint

class Router:
  def __init__(self, prefix: str):
    self._prefix = prefix
    self._blueprint = Blueprint(prefix, __name__)

  @property
  def blueprint(self):
    return self._blueprint
  
  @property
  def prefix(self):
    return self._prefix
  
  def format_path(self, path = ''):
    if not path:
      return ""
    return path if path.startswith("/") else f"/{path}"

  def get(self, render, path = ''):
    self._blueprint.route(f"{self.format_path(self._prefix)}{self.format_path(path)}", methods=["GET"])(render)

  def post(self, render, path = ''):
    self._blueprint.route(f"{self.format_path(self._prefix)}{self.format_path(path)}", methods=["POST"])(render)

  def put(self, render, path = ''):
    self._blueprint.route(f"{self.format_path(self._prefix)}{self.format_path(path)}", methods=["PUT"])(render)

  def patch(self, render, path = ''):
    self._blueprint.route(f"{self.format_path(self._prefix)}{self.format_path(path)}", methods=["PATCH"])(render)

  def delete(self, render, path = ''):
    self._blueprint.route(f"{self.format_path(self._prefix)}{self.format_path(path)}", methods=["DELETE"])(render)

  # def _chain_renders(self, *renders):
  #   def chained_render(*args, **kwargs):
  #     for render in renders:
  #       response = render(*args, **kwargs)
  #       if response is not None:
  #         return response
  #   return chained_render

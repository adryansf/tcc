from abc import abstractmethod
from .router import Router

class BaseModule:
  def __init__(self, prefix: str):
    self._prefix = prefix
    self._router = Router(prefix)
    self._routes()

  @property
  def router(self):
    return self._router.router

  @abstractmethod
  def _routes(self):
    return NotImplemented
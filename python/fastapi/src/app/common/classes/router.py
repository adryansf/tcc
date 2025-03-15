from fastapi import APIRouter
from fastapi import Depends

class Router:
  def __init__(self, prefix: str):
    self._prefix = self.format_path(prefix)
    self._router = APIRouter(prefix=self.format_path(prefix))

  @property
  def router(self):
    return self._router
  
  @property
  def prefix(self):
    return self._prefix
  
  def format_path(self, path = ''):
    if not path:
      return ""
    return path if path.startswith("/") else f"/{path}"

  def get(self, render, path = '', dependencies=[]):
    dependencies = list(map(lambda d: Depends(d), dependencies))
    self._router.get(f"{self.format_path(path)}", dependencies=dependencies)(render)

  def post(self, render, path = '', dependencies=[]):
    dependencies = list(map(lambda d: Depends(d), dependencies))
    self._router.post(f"{self.format_path(path)}", dependencies=dependencies)(render)

  def put(self, render, path = '', dependencies=[]):
    dependencies = list(map(lambda d: Depends(d), dependencies))
    self._router.put(f"{self.format_path(path)}", dependencies=dependencies)(render)

  def patch(self, render, path = '', dependencies=[]):
    dependencies = list(map(lambda d: Depends(d), dependencies))
    self._router.patch(f"{self.format_path(path)}", dependencies=dependencies)(render)

  def delete(self, render, path = '', dependencies=[]):
    dependencies = list(map(lambda d: Depends(d), dependencies))
    self._router.delete(f"{self.format_path(path)}", dependencies=dependencies)(render)
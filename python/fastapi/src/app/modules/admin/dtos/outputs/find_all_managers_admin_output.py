from pydantic import BaseModel
from typing import List, Optional
from app.modules.managers.entity import ManagerEntity

class FindAllManagersAdminOutputDto(BaseModel):
    managers: List[Optional[ManagerEntity]]

    def to_json(self):
        return [manager.to_json() for manager in self.managers]
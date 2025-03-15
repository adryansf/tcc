from pydantic import BaseModel
from typing import List, Optional
from app.modules.clients.entity import ClientEntity

class FindAllClientsAdminOutputDto(BaseModel):
    clients: List[Optional[ClientEntity]]

    def to_json(self):
        return [client.to_json() for client in self.clients]
from pydantic import BaseModel
from typing import List, Optional
from ...entity import AccountEntity

class FindAllAccountsOutputDto(BaseModel):
    accounts: List[Optional[AccountEntity]]

    def to_json(self):
        return [account.to_json() for account in self.accounts]
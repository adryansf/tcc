from typing import List
from pydantic import BaseModel
from app.modules.branchs.entity import BranchEntity

class FindAllBranchsOutputDto(BaseModel):
    branchs: List[BranchEntity]

    def to_json(self):
        return [branch.to_json() for branch in self.branchs]

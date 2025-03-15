from app.common.errors import BaseError
from app.common.errors.either import Either, Right

# Repository
from .repository import BranchsRepository
# Entity
from .entity import BranchEntity

class BranchsService:
    def __init__(self, repository: BranchsRepository):
        self._repository = repository

    def find_all(self) -> Either[BaseError, list[BranchEntity]]:
        branchs = self._repository.find_all()
        return Right(branchs)
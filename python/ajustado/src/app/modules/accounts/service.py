from typing import List
from uuid import UUID

# Commons
from app.common.helpers import has_permission
from app.common.errors.either import Either, Left, Right
from app.common.errors.base_error import BaseError
from app.common.errors import BadRequestError, NotFoundError, UnauthorizedError
from app.common.messages import MESSAGES
from app.common.enums import RoleEnum

# DTOs
from .dtos.inputs.create_account import CreateAccountDto
from .dtos.inputs.find_all_query_account import FindAllQueryAccountDto

from .entity import AccountEntity
from ..auth.interfaces.jwt_payload import JwtPayload

class AccountsService:
    def __init__(self, repositories):
        self._repositories = repositories

    def find_all(self, query: FindAllQueryAccountDto) -> Either[BaseError, List[AccountEntity]]:
        accounts = self._repositories['accounts'].find_all({'cpf': query.cpf})
        return Right(accounts)

    def create(self, data: CreateAccountDto, id_client: str, auth: JwtPayload) -> Either[BaseError, AccountEntity]:
        if auth['role'] == RoleEnum.MANAGER.value:
            manager = self._repositories['managers'].find_by_email(auth['email'])
            data.idAgencia = manager['idAgencia']

        if not data.idAgencia:
            return Left(BadRequestError(MESSAGES['error']['account']['BadRequest']['BranchRequired']))

        branch = self._repositories['branchs'].find_by_id(data.idAgencia)

        if not branch:
            return Left(BadRequestError(MESSAGES['error']['account']['BadRequest']['BranchNotExists']))

        if auth['role'] == RoleEnum.MANAGER.value:
            if not data.idCliente:
                return Left(BadRequestError(MESSAGES['error']['account']['BadRequest']['IdClient']))

            client = self._repositories['clients'].find_by_id(data.idCliente)

            if not client:
                return Left(BadRequestError(MESSAGES['error']['client']['NotFound']))

            id_client = client['id']

        new_account = self._repositories['accounts'].create({
            'idAgencia': data.idAgencia,
            'tipo': data.tipo.value,
            'idCliente': id_client,
        })

        return Right(new_account)

    def find_one(self, id: str, id_client: str, role: RoleEnum) -> Either[BaseError, AccountEntity]:
        permission = has_permission(role, RoleEnum.MANAGER)


        account = self._repositories['accounts'].find_by_id(id, True)

        if not account:
            return Left(NotFoundError(MESSAGES['error']['account']['NotFound']))

        if account['idCliente'] != UUID(id_client) and not permission:
            return Left(UnauthorizedError())

        return Right(account)

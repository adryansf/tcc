from app.common.http import Request
from pydantic import ValidationError

# Commons
from app.common.classes.base_controller import BaseController
from app.common.errors import BadRequestError

# DTOs
from .dtos.inputs.create_account import CreateAccountDto
from .dtos.inputs.find_one_account import FindOneAccountDto
from .dtos.outputs.find_all_accounts_output import FindAllAccountsOutputDto
from .dtos.inputs.find_all_query_account import FindAllQueryAccountDto

from .service import AccountsService
from .entity import AccountEntity

class AccountsController(BaseController):
    def __init__(self, service: AccountsService):
        self._service = service

    async def find_all(self, cpf: str):
        try:
            query = FindAllQueryAccountDto(**{'cpf': cpf})

            result = self._service.find_all(query)

            if result.is_left():
                raise result.value

            response = FindAllAccountsOutputDto(accounts=[AccountEntity(**account) for account in result.value])
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)

    async def find_one(self, request: Request, id: str):
        try:
            params = FindOneAccountDto(**{'id': id})

            result = self._service.find_one(id=params.id, id_client=request.state.auth['id'], role=request.state.auth['role'])

            if result.is_left():
                raise result.value

            response = AccountEntity(**result.value)
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)

    async def create(self, request: Request):
        try:
            data = await request.json()
            data = CreateAccountDto(**data)

            result = self._service.create(data=data, id_client=request.state.auth['id'], auth=request.state.auth)

            if result.is_left():
                raise result.value

            return self.sendSuccessWithoutBody(201)
        except ValidationError as e:
            raise BadRequestError(errors=e)

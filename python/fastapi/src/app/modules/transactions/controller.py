from pydantic import ValidationError

# Common
from app.common.http import Request
from app.common.classes.base_controller import BaseController
from app.common.errors import BadRequestError

# Transactions
from .service import TransactionsService
from .entity import TransactionEntity

# DTOs
from .dtos.inputs.create_transaction import CreateTransactionDto
from .dtos.outputs.findAll_transactions_dto import FindAllTransactionsOutputDto
from .dtos.inputs.find_all_query_transactions import FindAllQueryTransactionsDto


class TransactionsController(BaseController):
    def __init__(self, service: TransactionsService):
        self._service = service

    async def find_all(self, idConta: str, request: Request):
        try:
            id_conta = idConta

            query = FindAllQueryTransactionsDto(**{'idConta': id_conta})

            result = self._service.find_all(query.idConta, request.state.auth['id'], request.state.auth['role'])

            if result.is_left():
                raise result.value

            response = FindAllTransactionsOutputDto(transactions=[TransactionEntity(**transaction) for transaction in result.value])
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)

    async def create(self, request: Request):
        try:
            data = await request.json()
            data = CreateTransactionDto(**data)

            result = self._service.create(data=data, id_client=request.state.auth['id'])

            if result.is_left():
                raise result.value

            return self.sendSuccessWithoutBody(201)
        except ValidationError as e:
            raise BadRequestError(errors=e)

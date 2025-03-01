from pydantic import ValidationError

# Common
from app.common.http import request
from app.common.classes.base_controller import BaseController
from app.common.errors import BadRequestError

# Transactions
from .service import TransactionsService
from .entity import TransactionEntity

# DTOs
from .dtos.inputs.create_transaction import CreateTransactionDto
from .dtos.outputs.findAll_transactions_dto import FindAllTransactionsOutputDto
from .dtos.inputs.find_all_query_transactions import FindAllQueryTransactionsDto

# Auth
from ..auth.middlewares.auth import auth_middleware

class TransactionsController(BaseController):
    def __init__(self, service: TransactionsService):
        self._service = service

    @auth_middleware
    def find_all(self):
        try:
            id_conta = request.args.get('idConta')

            query = FindAllQueryTransactionsDto(**{'idConta': id_conta})

            result = self._service.find_all(query.idConta, request.auth['id'], request.auth['role'])

            if result.is_left():
                raise result.value

            response = FindAllTransactionsOutputDto(transactions=[TransactionEntity(**transaction) for transaction in result.value])
            return self.sendSuccess(response)
        except ValidationError as e:
            raise BadRequestError(errors=e)

    @auth_middleware
    def create(self):
        try:
            data = CreateTransactionDto(**request.json)

            result = self._service.create(data=data, id_client=request.auth['id'])

            if result.is_left():
                raise result.value

            return self.sendSuccessWithoutBody(201)
        except ValidationError as e:
            raise BadRequestError(errors=e)

from typing import List
from uuid import UUID

# Common
from app.common.helpers import has_permission
from app.common.enums import RoleEnum
from app.common.errors.either import Either, Left, Right
from app.common.errors.base_error import BaseError
from app.common.errors import BadRequestError, NotFoundError, UnauthorizedError, InternalServerError
from app.common.messages import MESSAGES
from app.database import db

# Transactions
from .entity import TransactionEntity
from .enums.transaction_type import TransactionTypeEnum

# DTOs
from .dtos.inputs.create_transaction import CreateTransactionDto

class TransactionsService:
    def __init__(self, repositories):
        self._repositories = repositories

    def create(self, data: CreateTransactionDto, id_client: str) -> Either[BaseError, TransactionEntity]:
        tipo = TransactionTypeEnum(data.tipo)

        origin_account = None

        if data.idContaDestino == data.idContaOrigem:
            return Left(BadRequestError(MESSAGES['error']['account']['BadRequest']['SameAccount']))

        # Verifica se contas existem
        if data.idContaOrigem:
            origin_account = self._repositories['accounts'].find_by_id(data.idContaOrigem)

            if not origin_account:
                return Left(NotFoundError(MESSAGES['error']['account']['NotFoundOrigin']))

            if origin_account['idCliente'] != UUID(id_client):
                return Left(UnauthorizedError())

        if data.idContaDestino:
            target_account = self._repositories['accounts'].find_by_id(data.idContaDestino)

            if not target_account:
                return Left(NotFoundError(MESSAGES['error']['account']['NotFoundTarget']))

        if (tipo == TransactionTypeEnum.TRANSFER or tipo == TransactionTypeEnum.WITHDRAWAL) and origin_account['saldo'] < data.valor:
            return Left(BadRequestError(MESSAGES['error']['account']['BadRequest']['BalanceNotEnough']))

        with db.connect() as conn:
            trx = conn.begin()

            try:
                if tipo == TransactionTypeEnum.DEPOSIT:
                    self._repositories['accounts'].add_balance(data.idContaDestino, data.valor, conn)
                elif tipo == TransactionTypeEnum.TRANSFER:
                    self._repositories['accounts'].remove_balance(data.idContaOrigem, data.valor, conn)
                    self._repositories['accounts'].add_balance(data.idContaDestino, data.valor, conn)
                elif tipo == TransactionTypeEnum.WITHDRAWAL:
                    self._repositories['accounts'].remove_balance(data.idContaOrigem, data.valor, conn)

                new_transaction = self._repositories['transactions'].create({
                    **{**data.model_dump(), 'tipo': tipo.value}
                }, conn)

                trx.commit()

                return Right(new_transaction)
            except Exception as e:
                trx.rollback()
                return Left(InternalServerError())          

        

    def find_all(self, id_account: str, id_client: str, role: RoleEnum) -> Either[BaseError, List[TransactionEntity]]:
        permission = has_permission(role, RoleEnum.MANAGER)

        account = self._repositories['accounts'].find_by_id(id_account)

        if not account:
            return Left(NotFoundError(MESSAGES['error']['account']['NotFound']))

        if account['idCliente'] != UUID(id_client) and not permission:
            return Left(UnauthorizedError())

        transactions = self._repositories['transactions'].find_all(id_account)

        return Right(transactions)

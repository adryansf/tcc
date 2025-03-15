from app.common.helpers.bcrypt import encrypt_password
from app.common.errors import BadRequestError, BaseError, NotFoundError
from app.common.messages import MESSAGES
from app.common.errors.either import Either, Left, Right

# DTOs
from .dtos.inputs.create_client import CreateClientDto

# Repositório
from .repository import ClientsRepository

# Entidades
from .entity import ClientEntity

class ClientsService:
    def __init__(self, repository: ClientsRepository):
        self._repository = repository

    def find_by_cpf(self, cpf: str) -> Either[BaseError, ClientEntity]:
        client = self._repository.find_by_cpf(cpf)
        if not client:
            return Left(NotFoundError(MESSAGES['error']['client']['NotFound']))
        return Right(client)

    def find_one(self, id: str) -> Either[BaseError, ClientEntity]:
        client = self._repository.find_by_id(id)
        if not client:
            return Left(NotFoundError(MESSAGES['error']['client']['NotFound']))
        return Right(client)

    def create(self, data: CreateClientDto) -> Either[BaseError, ClientEntity]:
        exists_email = self._repository.find_by_email(data.email)
        if exists_email:
            return Left(BadRequestError(MESSAGES['error']['client']['BadRequest']['EmailNotUnique']))

        exists_cpf = self._repository.find_by_cpf(data.cpf)
        if exists_cpf:
            return Left(BadRequestError(MESSAGES['error']['client']['BadRequest']['CPFNotUnique']))

        senha = encrypt_password(data.senha)
        client = self._repository.create({**data.model_dump(), 'senha': senha})
        return Right(client)

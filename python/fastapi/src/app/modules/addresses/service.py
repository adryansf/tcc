from .entity import AddressEntity

# DTOs
from .dtos.inputs.create_address import CreateAddressDto

# Commons
from app.common.errors import BadRequestError, BaseError, InternalServerError
from app.common.messages import MESSAGES
from app.common.errors.either import Either, Left, Right

class AddressesService:
    def __init__(self, repositories):
        self._repositories = repositories

    def create(self, data: CreateAddressDto, idClient: str) -> Either[BaseError, AddressEntity]:
        exists_client = self._repositories['clients'].find_by_id(idClient)
        if not exists_client:
            return Left(BadRequestError(MESSAGES['error']['client']['NotFound']))

        exists_address = self._repositories['addresses'].find_by_id_client(idClient)
        if exists_address:
            return Left(BadRequestError(MESSAGES['error']['address']['BadRequest']['AlreadyExists']))
        
        new_address = self._repositories['addresses'].create({**data.model_dump(), 'idCliente': idClient})

        if new_address == None:
            return Left(InternalServerError(MESSAGES['error']['InternalServer']))

        return Right(new_address)

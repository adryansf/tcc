# DTOs
from .dtos.inputs.login_auth_dto import LoginAuthDto
from .dtos.outputs.login_auth_clients_dto import LoginAuthClientsOutputDto
from .dtos.outputs.login_auth_managers_dto import LoginAuthManagersOutputDto

# Commons
from app.common.helpers.bcrypt import is_password_correct
from app.common.helpers import jwt
from app.common.errors import Either, Left, Right, BaseError, BadRequestError
from app.common.messages import MESSAGES
from app.common.enums import RoleEnum

class AuthService:
    def __init__(self, repositories):
        self._repositories = repositories

    def login_clients(self, data: LoginAuthDto) -> Either[BaseError, LoginAuthClientsOutputDto]:
        client = self._repositories['clients'].find_by_email(data.email)
        if not client:
            return Left(BadRequestError(MESSAGES['error']['auth']['BadRequest']))

        if not is_password_correct(data.senha, client['senha']):
            return Left(BadRequestError(MESSAGES['error']['auth']['BadRequest']))


        # Gerar token e retornar
        token_data = {
            'email': client['email'],
            'id': client['id'],
            'role': RoleEnum.CLIENT.value,
            'cpf': client['cpf'],
        }
        token, expires_in = jwt.generate_jwt(token_data)

        return Right({
            'token': token,
            'usuario': client,
            'expiraEm': expires_in.isoformat(),
        })

    def login_managers(self, data: LoginAuthDto) -> Either[BaseError, LoginAuthManagersOutputDto]:
        manager = self._repositories['managers'].find_by_email(data.email)
        if not manager:
            return Left(BadRequestError(MESSAGES['error']['auth']['BadRequest']))

        if not is_password_correct(data.senha, manager['senha']):
            return Left(BadRequestError(MESSAGES['error']['auth']['BadRequest']))



        # Gerar token e retornar
        token_data = {
            'email': manager['email'],
            'id': manager['id'],
            'role': RoleEnum.MANAGER.value,
            'cpf': manager['cpf'],
        }
        token, expires_in = jwt.generate_jwt(token_data)

        return Right({
            'token': token,
            'usuario': manager,
            'expiraEm': expires_in,
        })
import { CacheService } from "@/app/common/cache/cache.service";

// Repositories
import { ClientsRepository, ICreateClientData } from "./clients.repository";

// Dtos
import { CreateClientDto } from "./dtos/inputs/create-client.dto";

// Entities
import { ClientEntity } from "./entities/client.entity";

// Helpers
import { encryptPassword } from "@/common/helpers/bcrypt.helper";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { NotFoundError } from "@/app/common/errors/not-found.error";
import { InternalServerError } from "@/app/common/errors/internal-server.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

interface IClientsService {
  findOne: (id: string) => Promise<Either<BaseError, Partial<ClientEntity>>>;
  findByCPF: (cpf: string) => Promise<Either<BaseError, Partial<ClientEntity>>>;
  create: (
    data: ICreateClientData
  ) => Promise<Either<BaseError, Partial<ClientEntity>>>;
}

export class ClientsService implements IClientsService {
  constructor(
    private _repository: ClientsRepository,
    private _cacheService: CacheService
  ) {}

  async findByCPF(
    cpf: string
  ): Promise<Either<BaseError, Partial<ClientEntity>>> {
    const cacheKey = `client:cpf:${cpf}`;

    const cachedClient = await this._cacheService.get<Partial<ClientEntity>>(
      cacheKey
    );

    if (cachedClient) {
      return right(cachedClient);
    }

    const client = await this._repository.findByCPF(cpf);

    if (!client) {
      return left(new NotFoundError(MESSAGES.error.client.NotFound));
    }

    await this._cacheService.set(cacheKey, client);
    await this._cacheService.set(`client:id:${client.id}`, client);
    await this._cacheService.set(`client:email:${client.email}`, client);

    return right(client);
  }

  async findOne(id: string): Promise<Either<BaseError, Partial<ClientEntity>>> {
    const cacheKey = `client:id:${id}`;

    const cachedClient = await this._cacheService.get<Partial<ClientEntity>>(
      cacheKey
    );

    if (cachedClient) {
      return right(cachedClient);
    }

    const client = await this._repository.findById(id);

    if (!client) {
      return left(new NotFoundError(MESSAGES.error.client.NotFound));
    }

    await this._cacheService.set(cacheKey, client);
    await this._cacheService.set(`client:cpf:${client.cpf}`, client);
    await this._cacheService.set(`client:email:${client.email}`, client);

    return right(client);
  }

  async create(
    data: CreateClientDto
  ): Promise<Either<BaseError, Partial<ClientEntity>>> {
    const cacheKeyCPF = `client:cpf:${data.cpf}`;
    const cacheKeyEmail = `client:email:${data.email}`;

    const existsEmail = await this._repository.findByEmail(data.email);

    if (existsEmail) {
      return left(
        new BadRequestError(MESSAGES.error.client.BadRequest.EmailNotUnique)
      );
    }

    const existsCPF = await this._repository.findByCPF(data.cpf);

    if (existsCPF) {
      return left(
        new BadRequestError(MESSAGES.error.client.BadRequest.CPFNotUnique)
      );
    }

    const senha = await encryptPassword(data.senha);

    const client = await this._repository.create({ ...data, senha });
    

    if (client === null) {
      return left(new InternalServerError(MESSAGES.error.InternalServer));
    }

    await this._cacheService.set(cacheKeyEmail, client);
    await this._cacheService.set(cacheKeyCPF, client);
    await this._cacheService.set(`client:id:${client.id}`, client);
    return right(client);
  }
}

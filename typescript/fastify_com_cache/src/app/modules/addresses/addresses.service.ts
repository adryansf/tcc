// Entities
import { AddressEntity } from "./entities/address.entity";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Dtos
import { CreateAddressDto } from "./dtos/inputs/create-address.dto";

// Types
import { Repositories } from "./addresses.module";
import { CacheService } from "@/app/common/cache/cache.service";
import { InternalServerError } from "@/app/common/errors/internal-server.error";

interface IAddressesService {
  create: (
    data: CreateAddressDto,
    idClient: string,
    idLoggedUser: string
  ) => Promise<Either<BaseError, AddressEntity>>;
}

export class AddressesService implements IAddressesService {
  constructor(
    private _repositories: Repositories,
    private _cacheService: CacheService
  ) {}

  async create(
    data: Required<CreateAddressDto>,
    idClient: string
  ): Promise<Either<BaseError, AddressEntity>> {
    const client = await this._repositories.clients.findById(idClient);

    if (!client) {
      return left(new BadRequestError(MESSAGES.error.client.NotFound));
    }

    const existsAddress = await this._repositories.addresses.findByIdClient(
      idClient
    );

    if (existsAddress) {
      return left(
        new BadRequestError(MESSAGES.error.address.BadRequest.AlreadyExists)
      );
    }

    const newAddress = await this._repositories.addresses.create({
      ...data,
      idCliente: idClient,
    });

    if (newAddress === null) {
      return left(new InternalServerError(MESSAGES.error.InternalServer));
    }

    await this._cacheService.reset(`client:id:${client.id}`);
    await this._cacheService.reset(`client:cpf:${client.cpf}`);
    await this._cacheService.reset(`client:email:${client.email}`);

    return right(newAddress);
  }
}

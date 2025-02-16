// Helpers
import { hasPermission } from "@/app/common/helpers/permission.helper";

// Entities
import { AddressEntity } from "./entities/address.entity";

// Errors
import { Either, left, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";
import { BadRequestError } from "@/app/common/errors/bad-request.error";
import { UnauthorizedError } from "@/app/common/errors/unauthorized.error";

// Messages
import { MESSAGES } from "@/app/common/messages";

// Dtos
import { CreateAddressDto } from "./dtos/inputs/create-address.dto";

// Types
import { Repositories } from "./addresses.module";
import { RoleEnum } from "@/common/enums/role.enum";

interface IAddressesService {
  create: (
    data: CreateAddressDto,
    idClient: string,
    idLoggedUser: string
  ) => Promise<Either<BaseError, AddressEntity>>;
  findOne: (
    idClient: string,
    idLoggedUser: string,
    role: RoleEnum
  ) => Promise<Either<BaseError, AddressEntity>>;
}

export class AddressesService implements IAddressesService {
  constructor(private _repositories: Repositories) {}

  async create(
    data: Required<CreateAddressDto>,
    idClient: string,
    idLoggedUser: string
  ): Promise<Either<BaseError, AddressEntity>> {
    if (idClient !== idLoggedUser) {
      return left(new UnauthorizedError());
    }

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

    return right(newAddress);
  }

  async findOne(
    idClient: string,
    idLoggedUser: string,
    role: RoleEnum
  ): Promise<Either<BaseError, AddressEntity>> {
    const permission = hasPermission(role, RoleEnum.MANAGER);

    const client = await this._repositories.clients.findById(idClient);

    if (!client) {
      return left(new BadRequestError(MESSAGES.error.client.NotFound));
    }

    if (client.id !== idLoggedUser && !permission) {
      return left(new UnauthorizedError());
    }

    const address = await this._repositories.addresses.findByIdClient(idClient);

    if (!address) {
      return left(new BadRequestError(MESSAGES.error.address.NotFound));
    }

    return right(address);
  }
}

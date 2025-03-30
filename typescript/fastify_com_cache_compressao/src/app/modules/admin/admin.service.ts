// Entities
import { ManagerEntity } from "../managers/entities/manager.entity";
import { ClientEntity } from "../clients/entities/client.entity";

// Errors
import { Either, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";

// Dtos
import { FindAllQueryAdminDto } from "./dtos/inputs/findAllQuery-admin.dto";

// Types
import { Repositories } from "./admin.module";
import { RoleEnum } from "@/common/enums/role.enum";

interface IAdminService {
  findAllManagers: (
    query: FindAllQueryAdminDto,
    role: RoleEnum
  ) => Promise<Either<BaseError, Partial<ManagerEntity>[]>>;
  findAllClients: (
    query: FindAllQueryAdminDto,
    role: RoleEnum
  ) => Promise<Either<BaseError, Partial<ClientEntity>[]>>;
}

export class AdminService implements IAdminService {
  constructor(private _repositories: Repositories) {}

  async findAllManagers(
    query: FindAllQueryAdminDto
  ): Promise<Either<BaseError, Partial<ManagerEntity>[]>> {
    const managers = await this._repositories.managers.findAll(
      query.quantidade
    );

    return right(managers);
  }

  async findAllClients(
    query: FindAllQueryAdminDto
  ): Promise<Either<BaseError, Partial<ClientEntity>[]>> {
    const clients = await this._repositories.clients.findAll(query.quantidade);

    return right(clients);
  }
}

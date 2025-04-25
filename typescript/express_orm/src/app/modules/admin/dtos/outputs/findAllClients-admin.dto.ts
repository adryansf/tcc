import { ClientEntity } from "@/app/modules/clients/entities/client.entity";

export class FindAllClientsAdminOutputDto {
  private _clients: Partial<ClientEntity>[];

  constructor(partial: Partial<ClientEntity>[]) {
    this._clients = partial;
  }

  toJSON() {
    return this._clients.map((c) => c.toJSON());
  }
}

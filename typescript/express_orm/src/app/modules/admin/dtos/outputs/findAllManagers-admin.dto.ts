import { ManagerEntity } from "@/app/modules/managers/entities/manager.entity";

export class FindAllManagersAdminOutputDto {
  private _managers: Partial<ManagerEntity>[];

  constructor(partial: Partial<ManagerEntity>[]) {
    this._managers = partial;
  }

  toJSON() {
    return this._managers.map((m) => m.toJSON());
  }
}

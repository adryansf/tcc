// Entities
import { ManagerEntity } from "./entities/manager.entity";

interface IManagersRepository {
  findByEmail: (email: string) => Promise<Partial<ManagerEntity>>;
  findAll: (quantidade: number) => Promise<Partial<ManagerEntity>[]>;
}

export class ManagersRepository implements IManagersRepository {
  async findByEmail(email: string) {
    const result = await ManagerEntity.findOne({
      where: { email },
    });
    return result;
  }

  async findAll(quantidade: number) {
    const result = await ManagerEntity.findAll({
      limit: quantidade,
    });
    return result;
  }
}

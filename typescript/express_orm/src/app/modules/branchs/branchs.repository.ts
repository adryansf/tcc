// Entities
import { BranchEntity } from "./entities/branch.entity";

interface IBranchsRepository {
  findById: (id: string) => Promise<Partial<BranchEntity> | undefined>;
  findAll: () => Promise<BranchEntity[]>;
}

export class BranchsRepository implements IBranchsRepository {
  async findById(id: string) {
    const result = await BranchEntity.findOne({
      where: { id },
      limit: 1,
    });
    return result || undefined;
  }

  async findAll() {
    const result = await BranchEntity.findAll();
    return result;
  }
}

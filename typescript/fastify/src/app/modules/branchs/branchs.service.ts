// Repositories
import { BranchsRepository } from "./branchs.repository";

// Entities
import { BranchEntity } from "./entities/branch.entity";

// Errors
import { Either, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";

interface IBranchsService {
  findAll: () => Promise<Either<BaseError, Partial<BranchEntity[]>>>;
}

export class BranchsService implements IBranchsService {
  constructor(private _repository: BranchsRepository) {}

  async findAll(): Promise<Either<BaseError, Partial<BranchEntity[]>>> {
    const branchs = await this._repository.findAll();

    return right(branchs);
  }
}

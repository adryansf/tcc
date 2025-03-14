// Repositories
import { BranchsRepository } from "./branchs.repository";

// Entities
import { BranchEntity } from "./entities/branch.entity";

// Errors
import { Either, right } from "@/app/common/errors/either";
import { BaseError } from "@/app/common/errors/base.error";

// Cache
import { CacheService } from "@/app/common/cache/cache.service";

interface IBranchsService {
  findAll: () => Promise<Either<BaseError, Partial<BranchEntity[]>>>;
}

export class BranchsService implements IBranchsService {
  constructor(
    private _repository: BranchsRepository,
    private _cacheService: CacheService
  ) {}

  async findAll(): Promise<Either<BaseError, Partial<BranchEntity[]>>> {
    const cacheKey = `branchs:all`;
    const cachedBranchs = await this._cacheService.get<Partial<BranchEntity[]>>(
      cacheKey
    );

    if (cachedBranchs) {
      return right(cachedBranchs);
    }

    const branchs = await this._repository.findAll();

    await this._cacheService.set(cacheKey, branchs);

    return right(branchs);
  }
}

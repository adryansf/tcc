import { BranchEntity } from "../../entities/branch.entity";

export class FindAllBranchsOutputDto {
  private _branchs: Partial<BranchEntity>[];

  constructor(partial: Partial<BranchEntity>[]) {
    this._branchs = partial;
  }

  toJSON() {
    return this._branchs.map((b) => b.toJSON());
  }
}

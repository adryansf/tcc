import { AccountEntity } from "../../entities/account.entity";

export class FindAllAccountsOutputDto {
  private _accounts: Partial<AccountEntity>[];

  constructor(partial: Partial<AccountEntity>[]) {
    this._accounts = partial;
  }

  toJSON() {
    return this._accounts.map((a) => a.toJSON());
  }
}

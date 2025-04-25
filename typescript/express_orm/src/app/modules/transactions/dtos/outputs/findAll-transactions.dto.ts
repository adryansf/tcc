import { TransactionEntity } from "../../entities/transaction.entity";

export class FindAllTransactionsOutputDto {
  private _transactions: TransactionEntity[];

  constructor(partial: Partial<TransactionEntity[]>) {
    this._transactions = partial;
  }

  toJSON() {
    return this._transactions.map((t) => t.toJSON());
  }
}

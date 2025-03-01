from typing import List
from pydantic import BaseModel

# Transactions
from ...entity import TransactionEntity

class FindAllTransactionsOutputDto(BaseModel):
    transactions: List[TransactionEntity]

    def to_json(self):
        return [transaction.to_json() for transaction in self.transactions]
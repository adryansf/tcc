from typing import Generic, TypeVar, Union

L = TypeVar('L')
R = TypeVar('R')

class Either(Generic[L, R]):
    def __init__(self, value: Union[L, R]):
        self._value = value

    def is_left(self) -> bool:
        return isinstance(self, Left)

    def is_right(self) -> bool:
        return isinstance(self, Right)

    @property
    def value(self) -> Union[L, R]:
        return self._value

class Left(Either):
    def __init__(self, value: L):
        super().__init__(value)

class Right(Either):
    def __init__(self, value: R):
        super().__init__(value)

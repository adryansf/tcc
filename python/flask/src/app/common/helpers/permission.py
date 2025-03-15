from ..enums import RoleEnum

def has_permission(role: RoleEnum, *roles_permitted: RoleEnum) -> bool:
    return RoleEnum(role) in roles_permitted

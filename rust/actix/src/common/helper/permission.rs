use crate::common::enums::role::RoleEnum;

pub fn has_permission(role: RoleEnum, required_role: RoleEnum) -> bool {
    role == required_role
} 
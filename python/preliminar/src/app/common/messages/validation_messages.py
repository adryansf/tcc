validation_messages = {
    "is_email": lambda field_name: f"O campo {field_name} deve ser um email.",
    "is_string": lambda field_name: f"O campo {field_name} deve ser uma string.",
    "min_length": lambda field_name, min_length: f"O campo {field_name} deve ter no mínimo {min_length} caracteres.",
    "is_int": lambda field_name: f"O campo {field_name} deve ser um inteiro.",
    "is_boolean": lambda field_name: f"O campo {field_name} deve ser um valor booleano.",
    "invalid_cpf": lambda field_name: f"O campo {field_name} deve ser um CPF válido.",
    "is_uuid": lambda field_name: f"O campo {field_name} deve ser um UUID.",
    "is_positive": lambda field_name: f"O campo {field_name} deve ser um valor positivo.",
    "is_date_string": lambda field_name: f"O campo {field_name} deve ser uma data válida.",
    "max_length": lambda field_name, max_length: f"O campo {field_name} deve ter no máximo {max_length} caracteres."
}

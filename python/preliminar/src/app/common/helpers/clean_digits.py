def clean_digits(text: str) -> str:
    return text.replace("-", "").replace("_", "").replace(".", "").replace("(", "").replace(")", "").replace(" ", "")

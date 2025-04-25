export const cleanDigits = (text: string) => {
  return text
    .split("-")
    .join("")
    .split("_")
    .join("")
    .split(".")
    .join("")
    .split("(")
    .join("")
    .split(")")
    .join("")
    .split(" ")
    .join("");
};

import { genSalt, hash, compare } from "bcrypt";

export const encryptPassword = async (password: string) => {
  const salts = await genSalt(12);
  return hash(password, salts);
};

export const isPasswordCorrect = async (
  passwordToCompare: string,
  encryptedPassword: string
) => {
  return compare(passwordToCompare, encryptedPassword);
};

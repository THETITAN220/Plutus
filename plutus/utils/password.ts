import CryptoJS from "crypto-js";

// Generate a random salt
export const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

// Hash a password with a given salt
export const hashPassword = (password: string, salt: string) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations: 1000,
  }).toString();
};

// Compare entered password with stored hash
export const comparePassword = (
  enteredPassword: string,
  storedHash: string,
  salt: string
) => {
  const hash = hashPassword(enteredPassword, salt);
  return hash === storedHash;
};

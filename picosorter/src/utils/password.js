import bcrypt from 'bcryptjs';

/**
 * Hashes a password with a salt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

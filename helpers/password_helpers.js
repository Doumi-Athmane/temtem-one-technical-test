const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword(password) {
  try {

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    return false;
  }
}

// Function to verify a password against a hashed password
async function verifyPassword(plainPassword, hashedPassword) {
  try {
    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };

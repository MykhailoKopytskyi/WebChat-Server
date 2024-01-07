const bcrypt = require("bcrypt");

async function hash(plaintext) {
  try {
    const salt = await bcrypt.genSalt();
    const hashValue = await bcrypt.hash(plaintext, salt);
    return hashValue;
  }
  catch(e) {
    return false;
  }
}

async function compareHash(plaintext, hashValue) {
  try {
    const result = await bcrypt.compare(plaintext, hashValue);
    return result;
  }
  catch(e) {
    return false;
  }
}

module.exports={hash, compareHash};
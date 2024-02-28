const jwt = require("jsonwebtoken");

function createJWT(dataObject, key, expiration) {
  try {
    const token = jwt.sign(dataObject,key, {expiresIn: expiration}); 
    return token;
  }
  catch(e) {
    return false;
  }
}

function authorise(token, key) {
  try {
    const verifiedData = jwt.verify(token, key);
    return verifiedData;
  }
  catch(err) {
    return false;
  }
}

module.exports = {
  createJWT, 
  authorise
};
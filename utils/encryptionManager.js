const crypto = require("crypto");


function encrypt(plaintext, encryptionKey) {
  if( !plaintext || !encryptionKey ) {
    return false;
  }
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey), Buffer.alloc(16, 0) );
  let text = cipher.update(plaintext, "utf-8", "hex");
  let result = text + cipher.final("hex");
  return result;
}

function decrypt(ciphertext, encryptionKey) {
  try {
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey), Buffer.alloc(16, 0) );
    let text = decipher.update(ciphertext, "hex", "utf-8");
    let result = text + decipher.final("utf-8");
    return result;
  }
  catch(err) {
    return false;
  }
  
}

module.exports={encrypt,decrypt};
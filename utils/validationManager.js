const configuration = require("../config/config");

const emailValidation = (email) => {
  let emailRegEx = configuration.validation.emailRegExp;
  email = email.trim();  // get rid of spaces
  if( emailRegEx.test(email) == true) {
    return email;
  }
  return false;
}

const passwordValidation = (password) => {
  let passwordRegEx = configuration.validation.passwordRegExp;
  password = password.trim();
  if( passwordRegEx.test(password) == true) {
    return password;
  }
  return false;
}

const usernameValidation = (username) => {
  let usernameRegEx = configuration.validation.usernameRegExp;
  username = username.trim();
  if( usernameRegEx.test(username) == true) {
    return username;
  }
  return false;
}

module.exports={ emailValidation,passwordValidation, usernameValidation };
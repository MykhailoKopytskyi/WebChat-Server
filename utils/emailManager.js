const configuration = require("../config/config");


function sendEmail( recipientAddress, keyWord, URL  ) {
  return new Promise( (resolve, reject) => {
    const transporter = configuration.emailManagement.transporter();
    const emailInfo  = configuration.emailManagement.emailInfo(recipientAddress, keyWord , URL);
    
    transporter.sendMail( emailInfo , function(err,data) {
      if(err) {
        reject(false);
      }
      resolve(true);
    });
  } )
}


  module.exports = {sendEmail};

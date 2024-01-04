const nodemailer = require("nodemailer");
require("dotenv").config();


const configuration = {
  emailManagement:{
    transporter: () => {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth:{
          user: process.env.EMAIL_ADDRESS, // sender's email address
          pass: process.env.EMAIL_PASSWORD
        }
      })
    },
    emailInfo: (recipientAddress, keyWord, URL) => {
      return {
        from: process.env.EMAIL_ADDRESS ,
        to: recipientAddress,
        html: `<h1>Hello</h1> Click here to finish the process of ${keyWord}: ${URL}  `
      }
    }
  }
 
}


module.exports = configuration;
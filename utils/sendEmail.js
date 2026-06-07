const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create transporter (services that will send the email like "gmail" or "sendgrid" or "mailgun" )

  // @ts-ignore
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // if secure use 465 , else use 587
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define the email options (to, from, subject, message)
  const mailOptions = {
    from: `E-Commerce API <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) send email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;

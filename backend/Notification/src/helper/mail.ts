const nodemailer = require("nodemailer");
require("dotenv").config();
// Create a transporter object using Gmail SMTP server
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "zachary.goldner@ethereal.email",
//     pass: "7hgsvTvpMPsZHUEQq5",
//   },
// });

const email = "contactminatech@gmail.com"
const password = "cnwdnrateznivdgr"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  tls: {
    rejectUnauthorized: false,
  },
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: email,
    pass: password,
  },
});

const sendEmail = (data: any) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    const message = {
      from: "haileyabsera3@gmail.com",
      to: data.emails.join(", "),
      subject: "Notification From AASTU",
      text: ``,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Important Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      text-align: center;
      color: #333333;
    }

    p {
      color: #555555;
      line-height: 1.5;
    }

    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }

    .button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Important Notification</h1>
    <p>Dear User,</p>
    <p>${data.message}</p>
    <p>If you have any questions or concerns, please contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,<br>
    The AASTU SIMS Team</p>
  </div>
</body>
</html>`,
    };

    transporter.sendMail(message, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error); // Reject the promise with the error
      } else {
        console.log("Email sent successfully!");
        resolve(info); // Resolve the promise with the info object
      }
    });
  });
};

export { sendEmail };

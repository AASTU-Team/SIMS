const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using Gmail SMTP server
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmail = async (data) => {
  // Get the dynamic to address from the user
  // const toAddress = process.env.TO_ADDRESS;

  // Create a message object
  const message = {
    from: `"Sera.net" <${"sera"}>`,
    to: data.email,
    subject: "Interview Confirmation for [Position Name]",
    text: ``,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <title>Registration Confirmation</title>
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
        <h1>Welcome to Our Community!</h1>
        <p>Dear [Student Name],</p>
        <p>Thank you for registering on our page. We're excited to have you as part of our community!</p>
        <p>As a registered member, you'll have access to a wide range of resources and opportunities. We encourage you to explore the various features on our platform and make the most out of your membership.</p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team. We're here to help!</p>
        <p>Once again, welcome aboard!</p>
        <a href="http://localhost:5173/signup/${data.invitations}" class="button">Visit Our Website</a>
      </div>
    </body>
    </html>`,
  };

  // Send the email
  transporter.sendMail(message, (error, success) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
};
export { sendEmail };

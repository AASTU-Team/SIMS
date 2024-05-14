const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using Gmail SMTP server
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    const message = {
      from: `"Sera.net" <${"sera"}>`,
      to: data.email,
      subject: "Interview Confirmation for [Position Name]",
      text: ``,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
        <title>Interview Confirmation</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
        }
        
        h3 {
          margin-top: 0;
        }
        
        p {
          margin-bottom: 10px;
        }
        a {
            color: #000;
            text-decoration: none;
          }
        
        img {
          max-width: 100%;
        }
        </style>
        </head>
        <body>
        
        <p>
        I hope this email finds you well.${data.invitations}
        </p>
        
        <p>
        We are excited to learn more about your qualifications for this position and to discuss how you can contribute to our team.
        </p>
        
        <p>
        To prepare for the interview, please review the job description and bring a copy of your resume and any other relevant materials.
        </p>
        
        <p>
        We will be interviewing several candidates for this position, so please arrive on time. If you have any questions, please do not hesitate to contact me.
        </p>
        
        <p>
        We look forward to meeting you!
        </p>
        
        <h3>Sincerely,</h3>
        <br>
        
        <a href="www.google.com">Learn more about our company</a>
        </body>
        </html>
      `,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error(error);
        reject(error); // Reject the promise with the error
      } else {
        console.log("Email sent successfully!");
        resolve(info); // Resolve the promise with the info object
      }
    });
  });
}

export { sendEmail };
